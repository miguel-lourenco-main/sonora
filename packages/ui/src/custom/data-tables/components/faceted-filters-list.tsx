import { Table } from "@tanstack/react-table"

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Filter } from "../lib/interfaces";

export default function FacetedFilters({
    table,
    filters
}:{
    //TODO - fix: table: Table<TData>
    table: Table<any>
    filters: Filter[]
}){
    return(
        <>
            {filters.map((filter) => {
                {table.getColumn(filter.id) && (
                    <DataTableFacetedFilter
                        column={table.getColumn(filter.id)}
                        title={filter.id}
                        options={filter.options}
                    />
                )}
            })}
        </>
    )
}