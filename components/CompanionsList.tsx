
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {cn, getSubjectColor} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface CompanionsListProps {
    title: string;
    companions?: Companion[];
    classNames?: string;
}

const CompanionsList = ({ title, companions, classNames }: CompanionsListProps) => {
    return (
        <article className={cn('space-y-6', classNames)}>
            <div className="space-y-2">
                <h2 className="font-bold text-3xl text-foreground">{title}</h2>
                <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-card/50">
                            <TableRow className="border-b border-border/50 hover:bg-transparent">
                                <TableHead className="text-base font-semibold text-foreground w-2/3 py-4">Lessons</TableHead>
                                <TableHead className="text-base font-semibold text-foreground py-4">Subject</TableHead>
                                <TableHead className="text-base font-semibold text-foreground text-right py-4">Duration</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {companions?.map(({id, subject, name, topic, duration}) => (
                                <TableRow
                                    key={id}
                                    className="border-b border-border/30 hover:bg-primary/5 transition-colors duration-200 cursor-pointer"
                                >
                                    <TableCell className="py-4">
                                        <Link href={`/companions/${id}`}>
                                            <div className="flex items-center gap-3 group">
                                                <div
                                                    className="size-[64px] flex items-center justify-center rounded-lg max-md:hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow"
                                                    style={{
                                                        backgroundColor: `${getSubjectColor(subject)}15`,
                                                        border: `2px solid ${getSubjectColor(subject)}40`,
                                                    }}
                                                >
                                                    <Image
                                                        src={`/icons/${subject}.svg`}
                                                        alt={subject}
                                                        width={32}
                                                        height={32}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1 min-w-0">
                                                    <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                                                        {name}
                                                    </p>
                                                    <p className="text-sm text-foreground-secondary line-clamp-1">
                                                        {topic}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="subject-badge w-fit max-md:hidden">
                                            {subject}
                                        </div>
                                        <div
                                            className="flex items-center justify-center rounded-lg w-fit p-2 md:hidden shadow-sm"
                                            style={{
                                                backgroundColor: `${getSubjectColor(subject)}20`,
                                                border: `1.5px solid ${getSubjectColor(subject)}50`,
                                            }}
                                        >
                                            <Image
                                                src={`/icons/${subject}.svg`}
                                                alt={subject}
                                                width={18}
                                                height={18}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-2 w-full justify-end text-foreground font-semibold">
                                            <p className="text-lg">{duration}</p>
                                            <span className="max-md:hidden text-foreground-secondary text-sm">mins</span>
                                            <Image src="/icons/clock.svg" alt="minutes" width={16} height={16} className="md:hidden opacity-70" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </article>
    )
}

export default CompanionsList;