import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Link } from "@inertiajs/react"
import { SelectValue } from "@radix-ui/react-select";

interface LinkProps {
    active: boolean;
    label: string;
    url: string | null;
}

interface PaginationData {
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface PaginationProps {
    projects: PaginationData;
    perPage: string;
    onPerPageChange: (value: string) => void;
    totalCount: number;
    filteredCount: number;
    search: string;
}



export const Pagination = ({ projects, perPage, onPerPageChange, totalCount, filteredCount, search } : PaginationProps) => {
    
     projects.links[0].label = '&laquo; Anterior'
     const ultimaPag = projects.links[projects.links.length - 1];
     ultimaPag.label = 'Siguiente &raquo;'
     
    return (
        <div className="flex items-center justify-between mt-4">

            {/* Pagination information */}
            {search ? (
                <p>Mostrando <strong>{filteredCount}</strong> filtered result{filteredCount !== 1 && 's'} de <strong>{totalCount}</strong>{filteredCount !== 1 ? 'entradas' : 'entrada'} </p>

            ) : (
                <p>Mostrando <strong>{projects.from}</strong> a <strong>{projects.to}</strong> de <strong>{projects.total}</strong> {filteredCount !== 1 ? 'entradas' : 'entrada'} </p>
            )}

            {/* Select Per Page */}
            <div className="flex items-center gap-2">
                <span className="text-sm"> Registros por página:</span>
                <Select onValueChange={onPerPageChange} value={perPage}>
                    <SelectTrigger className="w-[90px]">
                        <SelectValue placeholder="Row" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="-1">All</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Pagination Link */}
            <div className="flex gap-2">
                {projects.links.map((link, index) => (
                    <Link
                        className={`px-3 py-2 border rounded ${link.active ? 'bg-gray-700 text-white' : ''}`}
                        href={link.url || '#'}
                        key={index}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    )

}