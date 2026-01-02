"use client";
import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { subjects } from "@/constants";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";
import { Filter } from "lucide-react";

const SubjectFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("subject") || "";

    const [subject, setSubject] = useState(query);

    useEffect(() => {
        let newUrl = "";
        if (subject === "all") {
            newUrl = removeKeysFromUrlQuery({
                params: searchParams.toString(),
                keysToRemove: ["subject"],
            });
        } else {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "subject",
                value: subject,
            });
        }
        router.push(newUrl, { scroll: false });
    }, [subject]);

    return (
        <div className="w-full">
            <Select onValueChange={setSubject} value={subject}>
                <SelectTrigger className="h-11 rounded-lg bg-card border border-border text-foreground capitalize focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 flex items-center gap-2 hover:border-primary/50 transition-colors duration-200">
                    <Filter className="w-4 h-4 text-foreground-muted flex-shrink-0" />
                    <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border rounded-lg shadow-lg">
                    <SelectItem
                        value="all"
                        className="capitalize cursor-pointer hover:bg-primary/10 transition-colors"
                    >
                        All subjects
                    </SelectItem>
                    {subjects.map((subject) => (
                        <SelectItem
                            key={subject}
                            value={subject}
                            className="capitalize cursor-pointer hover:bg-primary/10 transition-colors"
                        >
                            {subject}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SubjectFilter;