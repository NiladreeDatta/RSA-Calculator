
      "use strict";

      var e, d, n, l;
      /*Validate a number is prime or not*/
      function validatePrime(prime, nameOfPrime) {
        if (!isPrime(prime)) {
          alert(
            "'" +
              nameOfPrime +
              "' is not a prime number. Please enter a prime number."
          );
          return false;
        }
        if (prime <= 7) {
          alert("'" + nameOfPrime + "' should be greater than 7.");
          return false;
        }
        return true;
      }

      function calculate() {
        //Calculate n and l
        var p = document.getElementById("p").value;
        var q = document.getElementById("q").value;
        if (!(validatePrime(p, "p") && validatePrime(q, "q"))) return;
        n = p * q;
        document.getElementById("n").value = n;

        l = (p - 1) * (q - 1);
        document.getElementById("l").value = l;

        var es = findEncryptionKeys(l, n);
        document.getElementById("e").value = es[0];
        document.getElementById("enKeyListSpan").innerHTML =
          " Possible encryption keys are: " + es;
        encryptorChanged();
      }

      function encryptorChanged() {
        e = document.getElementById("e").value;

        var ds = findDecryptionKeys(e, l);
        ds.splice(ds.indexOf(e), 1); //remove encryption key from list
        d = ds[0];
        document.getElementById("d").value = d;
        document.getElementById("deKeyListSpan").innerHTML =
          " Possible decryption keys are: " + ds;

        document.getElementById("private-key").innerHTML =
          "(" + e + "," + n + ")";
        document.getElementById("public-key").innerHTML =
          "(" + d + "," + n + ")";
      }

      function decryptorChanged() {
        d = document.getElementById("d").value;
        document.getElementById("public-key").innerHTML =
          "(" + d + "," + n + ")";
      }

      function isPrime(num) {
        for (let i = 2, s = Math.sqrt(num); i <= s; i++)
          if (num % i === 0) return false;
        return num !== 1;
      }

      function findEncryptionKeys(l, n) {
        var arr = [];
        for (var i = 2; i < l; i++) {
          if (isCoPrime(i, l) && isCoPrime(i, n)) arr.push(i);
          if (arr.length > 5) break;
        }
        return arr;
      }

      function isCoPrime(a, b) {
        var aFac = findFactors(a);
        var bFac = findFactors(b);
        var result = aFac.every((x) => bFac.indexOf(x) < 0);
        return result;
      }

      var hashtable = new Object();

      function findFactors(num) {
        if (hashtable[num]) return hashtable[num];

        var half = Math.floor(num / 2), // Ensures a whole number <= num.
          result = [],
          i,
          j;

        //result.push(1); // 1 should be a part of every solution but for our purpose of COPRIME 1 should be excluded

        // Determine out increment value for the loop and starting point.
        num % 2 === 0 ? ((i = 2), (j = 1)) : ((i = 3), (j = 2));

        for (i; i <= half; i += j) {
          num % i === 0 ? result.push(i) : false;
        }

        result.push(num); // Always include the original number.
        hashtable[num] = result;
        return result;
      }

      function findDecryptionKeys(e, l) {
        var ds = [];
        for (var x = l + 1; x < l + 100000; x++) {
          if ((x * e) % l === 1) {
            ds.push(x);
            if (ds.length > 5) return ds;
          }
        }
        return ds;
      }

      function encrypt() {
        var m = document.getElementById("message").value;
        var ascii = Array.from(Array(m.length).keys()).map((i) =>
          m.charCodeAt(i)
        );
        document.getElementById("ascii").innerHTML = ascii;
        var encrypted = ascii.map((i) => powerMod(i, e, n));
        document.getElementById("encrypted-msg").innerHTML = encrypted;
        document.getElementById("encrypted-msg-textbox").value = encrypted;
      }

      function decrypt() {
        var cipher = stringToNumberArray(
          document.getElementById("encrypted-msg-textbox").value
        );
        var ascii = cipher.map((i) => powerMod(i, d, n));
        document.getElementById("ascii-decrypted").innerHTML = ascii;
        var message = "";
        ascii.map((x) => (message += String.fromCharCode(x)));
        document.getElementById("decrypted-msg").innerHTML = message;
      }

      function stringToNumberArray(str) {
        return str.split(",").map((i) => parseInt(i));
      }

      // calculates   base^exponent % modulus
      function powerMod(base, exponent, modulus) {
        if (modulus === 1) return 0;
        var result = 1;
        base = base % modulus;
        while (exponent > 0) {
          if (exponent % 2 === 1)
            //odd number
            result = (result * base) % modulus;
          exponent = exponent >> 1; //divide by 2
          base = (base * base) % modulus;
        }
        return result;
      }
  