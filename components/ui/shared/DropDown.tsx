// 'use client'
import { startTransition, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/lib/database/models/categroy.model";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "../input";
import { createCategory, getAllCategory } from "@/lib/actions/category.actions";

type DropdownPropes = {
  value?: string;
  onChangeHandler?: () => void;
};

const DropDown = ({ value, onChangeHandler }: DropdownPropes) => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [NewCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    createCategory({
      categoryName: NewCategory.trim(),
    }).then((categroy) => {
      setCategories((prevState) => [...prevState, categroy]);
    });
  };


  useEffect(()=>{
    const getCategories = async()=>{
      const categoryList = await getAllCategory()

      categoryList && setCategories(categoryList as ICategory[])
    }
    
    getCategories()
  },[])
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map((category) => (
            <SelectItem
              value={category._id}
              key={category._id}
              className="select-item p-regular-14"
            >
              {category.name}
            </SelectItem>
          ))}

        {/* dailog yahn sy start hai */}
        <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
            Add New Category
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white rounded-md">
            <AlertDialogHeader>
              <AlertDialogTitle>New Category </AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  type="text"
                  placeholder="Category Name"
                  className="input-field mt-3"
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => startTransition(handleAddCategory)}
              >
                Add
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
};

export default DropDown;
