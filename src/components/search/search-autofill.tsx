"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, MapPin, MapPinned } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AutofillEntry {
  type: "city" | "zip";
  label: string;
  value: string;
  count: number;
}

interface SearchAutofillProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function SearchAutofill({
  value,
  onChange,
  onSearch,
  placeholder = "Search by city, address, or ZIP...",
}: SearchAutofillProps) {
  const [entries, setEntries] = useState<AutofillEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load autofill data on mount
  useEffect(() => {
    fetch("/data/autofill.json")
      .then((r) => r.json())
      .then((data: AutofillEntry[]) => setEntries(data))
      .catch(() => setEntries([]));
  }, []);

  // Debounce input (150ms)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(value);
    }, 150);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value]);

  // Filter and sort: cities first, then ZIPs
  const filtered = useMemo(() => {
    if (debouncedQuery.length < 3) return [];
    const q = debouncedQuery.toLowerCase();
    const matches = entries.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.value.toLowerCase().includes(q)
    );
    const cities = matches.filter((e) => e.type === "city");
    const zips = matches.filter((e) => e.type === "zip");
    return [...cities, ...zips];
  }, [debouncedQuery, entries]);

  // Reset highlighted index when filtered results change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filtered.length]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
      setIsOpen(true);
    },
    [onChange]
  );

  const selectEntry = useCallback(
    (entry: AutofillEntry) => {
      onChange(entry.value);
      onSearch(entry.value);
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onChange, onSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || filtered.length === 0) {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filtered.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filtered.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
            selectEntry(filtered[highlightedIndex]);
          } else {
            onSearch(value);
            setIsOpen(false);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    },
    [isOpen, filtered, highlightedIndex, selectEntry, onSearch, value]
  );

  const showDropdown = isOpen && filtered.length > 0;

  return (
    <div ref={containerRef} className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className="h-12 pl-10 bg-background border-border"
      />

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-2xl border border-border bg-[#0C0D0F] shadow-xl">
          {/* Dropdown header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "match" : "matches"}
            </span>
          </div>

          {/* Results list */}
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered.map((entry, idx) => (
              <button
                key={`${entry.type}-${entry.value}`}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  idx === highlightedIndex
                    ? "bg-[#C8A960]/10 text-foreground"
                    : "text-foreground hover:bg-muted/50"
                }`}
                onClick={() => selectEntry(entry)}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                <span className="shrink-0 text-muted-foreground">
                  {entry.type === "city" ? (
                    <MapPin className="h-4 w-4" />
                  ) : (
                    <MapPinned className="h-4 w-4" />
                  )}
                </span>
                <span className="flex-1 truncate text-sm">
                  {entry.label}
                </span>
                <Badge
                  variant="outline"
                  className="shrink-0 rounded-full border-[#C8A960]/40 bg-[#C8A960]/10 text-[#C8A960] text-[10px] font-semibold uppercase tracking-wider px-2 py-0"
                >
                  {entry.type === "city" ? "City" : "ZIP"}
                </Badge>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {entry.count.toLocaleString()} properties
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}