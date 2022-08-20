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
    // TODO: Convert => 10
    to10 = function (x) {
        var y, p, n;
        y = 0;
        p = 1;
        x = x.split("");
        n = x.length;
        while (n--) {
            y += alpha.indexOf(x[n]) * p;
            p *= alpha.length;
        }
        return y;
    };
    // TODO:
    modInv = function (gen, mod) {
        var v, d, u, t, c, q;
        v = 1;
        d = gen;
        t = 1;
        c = mod % gen;
        u = Math.floor(mod / gen);
        while (d > 1) {
            q = Math.floor(d / c);
            d = d % c;
            v = v + q * u;
            if (d) {
                q = Math.floor(c / d);
                c = c % d;
                u = u + q * v;
            }
        }
        return d ? v : mod - u;
    };

    // TODO:
    modPow = function (base, exp, mod) {
        var res, x;
        if (exp === 0) {
            return 1;
        } else if (exp < 0) {
            exp = -exp;
            base = modInv(base, mod);
        }
        res = 1;
        while (exp > 0) {
            if (exp % 2 === 0) {
                base = (base * base) % mod;
                exp /= 2;
            } else {
                res = (res * base) % mod;
                exp--;
            }
        }
        return res;
    };
    p = 91744613;
    C = parseInt(C, 10);
    if (isNaN(C)) {
        C = Math.round(Math.sqrt(Math.random() * Math.random()) * (p - 2) + 2);
    }

    // TODO: Calc Beta
    B = modPow(gen, C, p);

    decrypt = function (a) {
        var d, x, y;
        x = a[1];
        y = modPow(a[0], -C, p);
        d = (x * y) % p;
        d = Math.round(d) % p;
        return alpha[d - 2];
    };
    encrypt = function (key, char) {
        var k, result;
        k = Math.ceil(Math.sqrt(Math.random() * Math.random()) * 1e10);
        char = alpha.indexOf(char) + 2;
        result = [];
        result[0] = modPow(key[1], k, key[0]);
        result[1] = (char * modPow(key[2], k, key[0])) % key[0];
        console.log(result);
        return result;
    };

    // TODO: Encrypt message
    f = function (message, key) {
        var n, x, result;
        result = [];
        message = message.split("");
        n = message.length;
        while (n--) {
            x = encrypt(key, message[n]);
            result.push(toAlpha(x[0]));
            result.push(toAlpha(x[1]));
        }
        result = result.join("");
        return result;
    };

    // TODO: Decrypt message
    g = function (message) {
        var n, m, dycrypted, x;
        m = [];
        n = message.length / 8;
        while (n--) {
            x = message[8 * n + 4];
            x += message[8 * n + 5];
            x += message[8 * n + 6];
            x += message[8 * n + 7];
            m.unshift(x);
            x = message[8 * n];
            x += message[8 * n + 1];
            x += message[8 * n + 2];
            x += message[8 * n + 3];
            m.unshift(x);
        }
        x = [];
        dycrypted = [];
        n = m.length / 2;
        while (n--) {
            x[0] = m[2 * n];
            x[1] = m[2 * n + 1];
            x[0] = to10(x[0]);
            x[1] = to10(x[1]);
            dycrypted.push(decrypt(x));
        }
        message = dycrypted.join("");
        return message;
    };

    return {
        pubKey: [p, gen, B], // [p, alpha, Beta]
        priKey: C, // a
        decrypt: g,
        encrypt: f,
    };
};

// Beta = alpha^a mod p (bp & nhân)

// // Usage:

// var Alice = Crypto(Alphabet, 69);

// var Bob = Crypto(Alphabet, 69);

// var message = "Hello!";
// console.log(message);
// // "Hello!"

// message = Alice.encrypt(message, Bob.pubKey);
// print(message);
// // "Pl)7t&rfGueuL@|)H'P,*<K\.hxw+∆d*`?Io)lg~Adz-6xrR" or something like it.

// message = Bob.decrypt(message);
// console.log(message);
// // "Hello!"
