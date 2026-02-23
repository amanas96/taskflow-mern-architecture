// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useDebounce } from "@/hooks/use-debounce";
// import { useEffect, useState } from "react";

// export function TaskFilters() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [search, setSearch] = useState(searchParams.get("search") || "");

//   const debouncedSearch = useDebounce(search, 500);

//   useEffect(() => {
//     const currentSearch = searchParams.get("search") || "";

//     // Only push if the debounced value is different from the URL value
//     if (debouncedSearch !== currentSearch) {
//       const params = new URLSearchParams(searchParams.toString());

//       if (debouncedSearch) {
//         params.set("search", debouncedSearch);
//       } else {
//         params.delete("search");
//       }

//       params.set("page", "1");

//       router.push(`?${params.toString()}`, { scroll: false });
//     }
//   }, [debouncedSearch, router, searchParams]);

//   const handleStatusChange = (value: string) => {
//     const params = new URLSearchParams(searchParams.toString());
//     if (value === "all") {
//       params.delete("status");
//     } else {
//       params.set("status", value);
//     }
//     params.set("page", "1");
//     router.push(`?${params.toString()}`);
//   };

//   return (
//     <div className="flex flex-col sm:flex-row gap-4 mb-6">
//       <div className="flex-1 max-w-sm">
//         <Input
//           placeholder="Search by title..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       <Select
//         defaultValue={searchParams.get("status") || "all"}
//         onValueChange={handleStatusChange}
//       >
//         <SelectTrigger className="w-[180px]">
//           <SelectValue placeholder="Filter by status" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Status</SelectItem>
//           <SelectItem value="pending">Pending</SelectItem>
//           <SelectItem value="completed">Completed</SelectItem>
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

export function TaskFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for the search input to keep typing smooth
  const [search, setSearch] = useState(searchParams.get("search") || "");

  // Delay the search update by 500ms to avoid spamming the backend
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const currentSearchInUrl = searchParams.get("search") || "";

    // Only update the URL if the debounced search is actually different
    if (debouncedSearch !== currentSearchInUrl) {
      const params = new URLSearchParams(searchParams.toString());

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }

      params.set("page", "1"); // Reset to page 1 on new search
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearch, router, searchParams]);

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value); // Sends "TODO" or "DONE" to the backend
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* SEARCH INPUT */}
      <div className="flex-1 max-w-sm">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white"
        />
      </div>

      {/* STATUS FILTER */}
      <Select
        defaultValue={searchParams.get("status") || "all"}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {/* Enum Values: TODO and DONE */}
          <SelectItem value="TODO">Pending</SelectItem>
          <SelectItem value="DONE">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
