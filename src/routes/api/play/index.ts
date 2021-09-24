import type { ServerRequest, ServerResponse } from "@sveltejs/kit/types/hooks";

import { Card } from "$database";

// TODO (William): Might be better off in a Key-value store
const cardsMap = new Map<string, Set<number>>();

export async function get(req: ServerRequest): Promise<ServerResponse> {
    // Count always returns an array where the first object only contains a count attribute
    const cardCountResult = await Card.query()
        .count() as unknown;

    const cardCount = cardCountResult[0].count;

    const { sessionid } = req.locals;

    let cardIds = cardsMap.get(sessionid);

    if (!cardIds || cardIds.size >= cardCount) {
        cardIds = new Set<number>();
    }

    const row = Math.floor(Math.random() * (cardCount - cardIds.size));

    const card = await Card.query()
        .withGraphFetched('category')
        .whereNotIn('id', Array.from(cardIds))
        .orderBy('id')
        .limit(1)
        .offset(row)
        .first();

    cardIds.add(card.id);

    cardsMap.set(sessionid, cardIds);
    
    return {
        status: 303,
        headers: {
            location: `/jouer/${card.slug}`
        }
    }
}