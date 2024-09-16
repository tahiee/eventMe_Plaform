"use client";
import { useEffect, useState } from "react";
import SearchIcon from "../../../public/assets/icons/search.svg";
import { Input } from "../input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const Search = ({
  placeholder = "Search Title...",
}: {
  placeholder?: string;
}) => {
  const [query, setquery] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";
      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: query,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });
      }
      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);
  return (
    <>
      <div className=" flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
        <SearchIcon alt="search" width={24} height={24} />
        <Input
          type="text"
          placeholder={placeholder}
          onChange={(e) => setquery(e.target.value)}
          className="p-regular-16 border-0 bg-grey-50 outline-offset-0 placeholder:text-grey-500 focused:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </>
  );
};

export default Search;
