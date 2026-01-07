import type { Suggestion, SuggestionCategory } from "./suggestions-config";

const SUGGESTIONS_REGEX = /```suggestions\s*([\s\S]*?)```/;
const VALID_CATEGORIES: SuggestionCategory[] = [
	"deep-dive",
	"pivot",
	"action",
	"clarify",
];

export type ParsedContent = {
	content: string;
	suggestions: Suggestion[];
};

export function parseSuggestions(text: string): ParsedContent {
	const match = text.match(SUGGESTIONS_REGEX);

	if (!match) {
		return { content: text, suggestions: [] };
	}

	const jsonString = match[1].trim();
	const contentWithoutSuggestions = text.replace(SUGGESTIONS_REGEX, "").trim();

	try {
		const parsed = JSON.parse(jsonString);

		if (!Array.isArray(parsed)) {
			return { content: contentWithoutSuggestions, suggestions: [] };
		}

		const suggestions: Suggestion[] = parsed
			.filter(
				(item): item is { category: string; text: string } =>
					typeof item === "object" &&
					item !== null &&
					typeof item.category === "string" &&
					typeof item.text === "string" &&
					VALID_CATEGORIES.includes(item.category as SuggestionCategory),
			)
			.slice(0, 4)
			.map((item, index) => ({
				id: `suggestion-${Date.now()}-${index}`,
				text: item.text.slice(0, 100), // Max 100 chars
				category: item.category as SuggestionCategory,
			}));

		return { content: contentWithoutSuggestions, suggestions };
	} catch {
		return { content: contentWithoutSuggestions, suggestions: [] };
	}
}

export function hasSuggestionsBlock(text: string): boolean {
	return SUGGESTIONS_REGEX.test(text);
}
