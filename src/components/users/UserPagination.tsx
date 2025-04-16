
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  indexOfFirstUser: number;
  indexOfLastUser: number;
  totalUsers: number;
  onPageChange: (page: number) => void;
}

export const UserPagination: React.FC<UserPaginationProps> = ({
  currentPage,
  totalPages,
  indexOfFirstUser,
  indexOfLastUser,
  totalUsers,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <div className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium">{indexOfFirstUser + 1}</span> a{" "}
        <span className="font-medium">
          {Math.min(indexOfLastUser, totalUsers)}
        </span>{" "}
        de <span className="font-medium">{totalUsers}</span> usuários
      </div>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
          const pageNum = currentPage === 1 
            ? i + 1 
            : currentPage === totalPages 
            ? totalPages - 2 + i 
            : currentPage - 1 + i;
          
          if (pageNum > 0 && pageNum <= totalPages) {
            return (
              <Button
                key={i}
                variant={pageNum === currentPage ? "default" : "outline"}
                className="h-8 w-8"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          }
          return null;
        })}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
