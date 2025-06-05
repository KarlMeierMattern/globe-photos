import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type PlaceSuggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

type Props = {
  value: string;
  onSelect: (place: PlaceSuggestion) => void;
  disabled?: boolean;
};

export default function LocationAutocomplete({
  value,
  onSelect,
  disabled,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState(value);
  const [suggestions, setSuggestions] = React.useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setInput(value);
  }, [value]);

  const fetchSuggestions = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {input ? input : "Type a location..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type a location..."
            value={input}
            onValueChange={(val) => {
              setInput(val);
              if (val.length > 2) fetchSuggestions(val);
            }}
            disabled={disabled}
          />
          <CommandList>
            {loading && <div className="p-2 text-sm">Loading...</div>}
            <CommandEmpty>No locations found.</CommandEmpty>
            <CommandGroup>
              {suggestions.map((place) => (
                <CommandItem
                  key={place.display_name}
                  value={place.display_name}
                  onSelect={() => {
                    setInput(place.display_name);
                    setOpen(false);
                    onSelect(place);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      input === place.display_name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {place.display_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
