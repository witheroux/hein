import { Card } from "$database";

export async function get() {
    // Count always returns an array where the first object only contains a count attribute
    const cardCount = await Card.query()
        .count() as unknown;

    const row = Math.floor(Math.random() * cardCount[0].count);

    const card = await Card.query()
        .withGraphFetched('category')
        .orderBy('id')
        .limit(1)
        .offset(row)
        .first();
    
    return {
        status: 303,
        headers: {
            location: `/jouer/${card.slug}`
        }
    }
}