import fs from 'fs/promises';

export default function rawSvg() {
    const cache = new Map();
    const svgRegExp = /\.svg/

    return {
        name: 'rawsvg',
        async transform(source, id) {
            if (svgRegExp.test(id)) {
                try {
                    let svg = cache.get(id);
                    if (!svg) {
                        svg = await fs.readFile(id, { encoding: 'utf-8'});
                        cache.set(id, svg);
                    }
                    return {
                        code: `\nexport default \`${svg}\``,
                        map: null,
                    }
                } catch (err) {
                    console.error(`unable to retrieve file ${id}`);
                }
            }

            return undefined;
        }
    }
}