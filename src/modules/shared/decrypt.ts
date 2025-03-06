import { hkdf } from "@panva/hkdf";
import { base64url, calculateJwkThumbprint, jwtDecrypt } from "jose";

const alg = "dir";
const enc = "A256CBC-HS512";

async function getDerivedEncryptionKey(
  enc: string,
  keyMaterial: Uint8Array | string,
  salt: Uint8Array | string,
) {
  let length;

  console.log("enc", enc);

  switch (enc) {
    case "A256CBC-HS512": {
      length = 64;
      break;
    }
    case "A256GCM": {
      length = 32;
      break;
    }
    default: {
      throw new Error("Unsupported JWT Content Encryption Algorithm");
    }
  }
  return await hkdf(
    "sha256",
    keyMaterial,
    salt,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `Auth.js Generated Encryption Key (${salt})`,
    length,
  );
}

export async function decode(params: {
  token: string;
  secret: string | string[];
  salt: string;
}) {
  const { token, secret, salt } = params;

  const secrets = Array.isArray(secret) ? secret : [secret];
  if (!token) return;
  const { payload } = await jwtDecrypt(
    token,
    async ({ kid, enc }) => {
      for (const secret of secrets) {
        const encryptionSecret = await getDerivedEncryptionKey(
          enc,
          secret,
          salt,
        );
        if (kid === undefined) return encryptionSecret;

        let hashAlg: "sha256" | "sha384" | "sha512";
        const bits = encryptionSecret.byteLength << 3;
        switch (bits) {
          case 256: {
            hashAlg = "sha256";
            break;
          }
          case 384: {
            hashAlg = "sha384";
            break;
          }
          case 512: {
            hashAlg = "sha512";
            break;
          }
          default: {
            throw new Error("Unsupported hash length");
          }
        }

        const thumbprint = await calculateJwkThumbprint(
          { kty: "oct", k: base64url.encode(encryptionSecret) },
          hashAlg,
        );
        if (kid === thumbprint) return encryptionSecret;
      }

      throw new Error("no matching decryption secret");
    },
    {
      clockTolerance: 15,
      keyManagementAlgorithms: [alg],
      contentEncryptionAlgorithms: [enc, "A256GCM"],
    },
  );
  return payload;
}

// await decode({
//   salt: "authjs.session-token",
//   token:
//     "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiaG9hUGhVYUdoZk5SX2RWWFFaVnpkYnFOakdhTlh3dVcwMW51bkNJZXhRQ0NQRUZyS2swcHFsTUg0YW1neDVmZ2dwMzYxdEN6UVNBT3ZQXzhhTGhqdUEifQ..nBV_fAzjfgw1oEyL1JCAjA.Nkyj0J1kkr2D3GXFDiYIZSW5irxvLUUXpoW6J5wA0QqELrObljmlXGWsN9Pwm1vbBFXFPQHWP76uXK0sbx2Mh4Z2S4ThFx7pj4RcS4qiL16HJRiNW9_JRcCAG5P3J1vO9JSLydsw4buo_qaaI-22a8R_PFwFIwkX2Y3FlSXmOn_XdZ16gs1VBD706ouxOccKzx8nolyTycb7YlSfaZHU_RpwrnzPGPIB9nYDCr-kWVJcgLZySq48FrfYIzzmdC1UQryWyUNjUKIZmYf-IQMK2KBo_duEUp8UTMqSW-g0qYx3--b9pPqM685sKWK0BChUloVjVha97G2bpWWTYHJNrWVBvRRZfd2z33LE2Zf_ixXK6lNwfCgBYX1sx5zgnZsPSu_yBSwI_HXHmhGE2vtfWQ.J4zYYlTF3m_9UJ6SeTKUX4vYl3hHYJciGGjv2dNSuUY",
//   secret: "GziCIztsFiNGOwYqRavDLQEprLdbup51IryC/YCqluc=",
// }).then(value => console.log(value));
