import type { ServerRequest, ServerResponse } from "@sveltejs/kit/types/hooks";

import { Card } from "$database";
import { isEnhanced } from "$utils/helpers/request";
import { StatusCode } from "$utils/constants/httpResponse";

export async function get({ headers, locals }: ServerRequest): Promise<ServerResponse> {
    const enhanced = isEnhanced(headers);
    const { session } = locals;
    let { cards } = session;
    
    // Count always returns an array where the first object only contains a count attribute
    const cardCountResult = await Card.query()
        .count() as unknown;

    const cardCount = cardCountResult[0].count;

    if (!cards || cards.size >= cardCount) {
        cards = new Set<number>();
    }

    const row = Math.floor(Math.random() * (cardCount - cards.size));

    const card = await Card.query()
        .withGraphFetched('category')
        .whereNotIn('id', Array.from(cards))
        .orderBy('id')
        .limit(1)
        .offset(row)
        .first();

    cards.add(card.id);

    session.cards = cards;

    if (enhanced) {
        return {
            status: StatusCode.OK,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...card
            }),
        }
    }
    
    return {
        status: StatusCode.SEE_OTHER,
        headers: {
            location: `/jouer/${card.slug}`
        }
    }
}