"use client";

import { useEffect, useState } from "react";
import { Input } from "../input";
import SearchIcon from "../../../public/assets/icons/search.svg";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategory } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/categroy.model";

const CategoryFilter = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategory();

      categoryList && setCategories(categoryList as ICategory[]);
    };

    getCategories();
  }, []);

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     let newUrl = "";
  //     if (categories) {
  //       newUrl = formUrlQuery({
  //         params: searchParams.toString(),
  //         key: "categories",
  //         value: categories,
  //       });
  //     } else {
  //       newUrl = removeKeysFromQuery({
  //         params: searchParams.toString(),
  //         keysToRemove: ["category"],
  //       });
  //     }
  //     router.push(newUrl, { scroll: false });
  //   }, 300);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [categories, searchParams, router]);

  const onSelectCatergory = (category: string) => {
    let newUrl = "";
    if (category && category !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value: category,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      });
    }
    router.push(newUrl, { scroll: false });
  };

  return (
    <>
      <Select onValueChange={(value: string) => onSelectCatergory(value)}>
        <SelectTrigger className="select-field">
          <SelectValue placeholder="Catergory" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All" className="select-item p-regular-14">
            All Catergories
          </SelectItem>

          {categories.map((category) => (
            <SelectItem
              value={category.name}
              key={category._id}
              className="select-item p-regular-14"
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default CategoryFilter;
