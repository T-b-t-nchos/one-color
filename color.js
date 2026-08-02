function getColor() {
    let color = null;

    // ?color=xxxx
    const params = new URLSearchParams(location.search);
    color = params.get("color");

    if (color) {
        color = color.replace(/^#/, "");
    }

    // #xxxx
    if (!color && location.hash.length > 1) {
        color = location.hash.substring(1);
    }

    // /xxxx
    if (!color) {
        const path = location.pathname
            .replace(/\/+$/, "")
            .split("/")
            .pop();

        if (path && path.toLowerCase() !== "index.html") {
            color = path;
        }
    }

    if (
        color &&
        /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(color)
    ) {
        if (color.length === 3) {
            color =
                color[0] + color[0] +
                color[1] + color[1] +
                color[2] + color[2];
        }

        return "#" + color.toUpperCase();
    }

    return null;
}

function getTextColor(color) {
    const hex = color.startsWith("#") ? color.slice(1) : color;

    const [r, g, b] = hex.length === 3
        ? [
            parseInt(hex[0] + hex[0], 16),
            parseInt(hex[1] + hex[1], 16),
            parseInt(hex[2] + hex[2], 16)
        ]
        : [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16)
        ];

    const brightness =
        r * 0.299 +
        g * 0.587 +
        b * 0.114;

    if (brightness > 186) {
        return `rgb(${Math.round(r * 0.12)}, ${Math.round(g * 0.12)}, ${Math.round(b * 0.12)})`;
    }

    return `rgb(${
        Math.round(r + (255 - r) * 0.88)
    }, ${
        Math.round(g + (255 - g) * 0.88)
    }, ${
        Math.round(b + (255 - b) * 0.88)
    })`;
}

function analyzeColor(hex) {
    const rgb = hexToRgb(hex);

    return {
        HEX: rgbToHex(rgb),
        RGB: rgb,
        HSV: rgbToHsv(rgb),
        HSL: rgbToHsl(rgb),
        CMYK: rgbToCmyk(rgb),
        XYZ: rgbToXyz(rgb),
        LAB: xyzToLab(rgbToXyz(rgb)),
        LCH: labToLch(xyzToLab(rgbToXyz(rgb))),
        YUV: rgbToYuv(rgb),
        YIQ: rgbToYiq(rgb),
        GRAYSCALE: rgbToGrayscale(rgb)
    };
}


function hexToRgb(hex) {
    hex = hex.replace("#", "");

    if (hex.length === 3) {
        hex = [...hex]
            .map(v => v + v)
            .join("");
    }

    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
    };
}


function rgbToHex({r, g, b}) {
    return "#" + [r, g, b]
        .map(v => v.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
}


function rgbToHsv({r, g, b}) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h = 0;

    if (d !== 0) {
        switch (max) {
            case r:
                h = ((g - b) / d) % 6;
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h *= 60;
        if (h < 0) h += 360;
    }

    return {
        h: round(h, 2),
        s: round(max === 0 ? 0 : d / max * 100, 2),
        v: round(max * 100, 2)
    };
}


function rgbToHsl({r, g, b}) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0;
    let s = 0;

    const l = (max + min) / 2;
    const d = max - min;

    if (d !== 0) {
        s = d / (1 - Math.abs(2 * l - 1));

        switch(max) {
            case r:
                h = ((g - b) / d) % 6;
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h *= 60;
        if (h < 0) h += 360;
    }

    return {
        h: round(h, 2),
        s: round(s * 100, 2),
        l: round(l * 100, 2)
    };
}


function rgbToCmyk({r, g, b}) {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);

    if (k === 1) {
        return {
            c: 0,
            m: 0,
            y: 0,
            k: 100
        };
    }

    return {
        c: round((1 - r - k) / (1 - k) * 100, 2),
        m: round((1 - g - k) / (1 - k) * 100, 2),
        y: round((1 - b - k) / (1 - k) * 100, 2),
        k: round(k * 100, 2)
    };
}


function rgbToXyz({r, g, b}) {
    r = gammaCorrect(r / 255);
    g = gammaCorrect(g / 255);
    b = gammaCorrect(b / 255);

    return {
        x: round((r * 0.4124 + g * 0.3576 + b * 0.1805) * 100, 4),
        y: round((r * 0.2126 + g * 0.7152 + b * 0.0722) * 100, 4),
        z: round((r * 0.0193 + g * 0.1192 + b * 0.9505) * 100, 4)
    };
}


function gammaCorrect(v) {
    return v <= 0.04045
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
}


function xyzToLab({x, y, z}) {
    x /= 95.047;
    y /= 100;
    z /= 108.883;

    x = labPivot(x);
    y = labPivot(y);
    z = labPivot(z);

    return {
        l: round(116 * y - 16, 2),
        a: round(500 * (x - y), 2),
        b: round(200 * (y - z), 2)
    };
}


function labPivot(v) {
    return v > 0.008856
        ? Math.cbrt(v)
        : (7.787 * v) + (16 / 116);
}


function labToLch({l, a, b}) {
    return {
        l: round(l, 2),
        c: round(Math.sqrt(a * a + b * b), 2),
        h: round(
            Math.atan2(b, a) * 180 / Math.PI < 0
                ? Math.atan2(b, a) * 180 / Math.PI + 360
                : Math.atan2(b, a) * 180 / Math.PI,
            2
        )
    };
}


function rgbToYuv({r, g, b}) {
    return {
        y: round(0.299 * r + 0.587 * g + 0.114 * b, 2),
        u: round(-0.14713 * r - 0.28886 * g + 0.436 * b, 2),
        v: round(0.615 * r - 0.51499 * g - 0.10001 * b, 2)
    };
}


function rgbToYiq({r, g, b}) {
    return {
        y: round(0.299 * r + 0.587 * g + 0.114 * b, 2),
        i: round(0.596 * r - 0.274 * g - 0.322 * b, 2),
        q: round(0.211 * r - 0.523 * g + 0.312 * b, 2)
    };
}


function rgbToGrayscale({r, g, b}) {
    return round(
        0.299 * r +
        0.587 * g +
        0.114 * b,
        2
    );
}


function round(value, digits = 2) {
    return Number(value.toFixed(digits));
}


function randomColor(short = false) {
    const chars = "0123456789abcdef";
    
    if (short) {
        return "#" + Array.from({ length: 3 }, () =>
            chars[Math.floor(Math.random() * 16)]
        ).join("");
    }

    return "#" + Array.from({ length: 6 }, () =>
        chars[Math.floor(Math.random() * 16)]
    ).join("");
}
