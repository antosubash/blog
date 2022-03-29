import React from "react";
import Link from "./link";
interface Props {
  totalPages: number;
  currentPage: number;
}

const Pagination = (props: Props) => {
  const prevPage = props.currentPage - 1 > 0;
  const nextPage = props.currentPage + 1 <= props.totalPages;
  return (
    <div className="pt-6 pb-8 space-y-2 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!prevPage}
          >
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={
              props.currentPage - 1 === 1
                ? `/page`
                : `/page/${props.currentPage - 1}`
            }
          >
            <button>Previous</button>
          </Link>
        )}
        <span>
          {props.currentPage} of {props.totalPages}
        </span>
        {!nextPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!nextPage}
          >
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/page/${props.currentPage + 1}`}>
            <button>Next</button>
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Pagination;
