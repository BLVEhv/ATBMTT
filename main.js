const Crypto = function (alpha, gen, C) {
    var p, B, encrypt, decrypt, f, g, modInv, modPow, toAlpha, to10;
    // TODO: Convert => Alphabet
    toAlpha = function (x) {
        var y, p, l, n;
        if (x === 0) {
            return "!!!!";
        }
        y = [];
        n = 4;
        n = Math.ceil(n);
        while (n--) {
            p = Math.pow(alpha.length, n);
            l = Math.floor(x / p);
            y.push(alpha[l]);
            x -= l * p;
        }
        y = y.join("");
        return y;
    };
};