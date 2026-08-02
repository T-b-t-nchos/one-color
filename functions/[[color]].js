export async function onRequest(context) {
    const url = new URL(context.request.url);

    let color =
        context.params.color ??
        url.searchParams.get("color");

    color = normalizeColor(color);

    const response = await context.env.ASSETS.fetch(
        new Request(new URL("/index.html", url))
    );

    return new HTMLRewriter()
        .on("head", {
            element(element) {
                if (color) {
                    element.append(
                        `
<meta name="theme-color" content="${color}">
<meta property="og:title" content="One Color - ${color}">
<meta property="og:description" content="A color previewer - show one color.">
<meta property="og:type" content="website">
                        `,
                        {
                            html: true
                        }
                    );
                }
            }
        })
        .transform(response);
}


function normalizeColor(color) {
    if (!color) {
        return null;
    }

    color = color.replace(/^#/, "");

    if (/^[0-9a-fA-F]{3}$/.test(color)) {
        color = color
            .split("")
            .map(c => c + c)
            .join("");
    }

    if (!/^[0-9a-fA-F]{6}$/.test(color)) {
        return null;
    }

    return "#" + color.toUpperCase();
}
