// Define a type for the cookie options for clarity
interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none' | boolean; // boolean for true/false based on 'None'
  path?: string;
  expires?: Date;
  maxAge?: number; // In seconds
  domain?: string;
}

/**
 * Parses an array of raw 'Set-Cookie' header strings into
 * an array of objects suitable for Next.js's `cookies().set()` method.
 *
 * @param setCookieHeaders An array of raw 'Set-Cookie' header strings (e.g., from axiosResponse.headers['set-cookie']).
 * @returns An array of { name, value, options } objects, or an empty array if parsing fails.
 */
export function parseAndFormatCookies(
  setCookieHeaders: string[]
): Array<{ name: string; value: string; options: CookieOptions }> {
  const parsedCookies: Array<{
    name: string;
    value: string;
    options: CookieOptions;
  }> = [];

  if (!setCookieHeaders || !Array.isArray(setCookieHeaders)) {
    return parsedCookies;
  }

  setCookieHeaders.forEach((cookieString) => {
    try {
      const parts = cookieString.split(';');
      const nameValuePair = parts[0].split('=');
      const cookieName = nameValuePair[0].trim();
      const cookieValue = nameValuePair.slice(1).join('=').trim(); // Handles values containing '='

      const cookieOptions: CookieOptions = {};

      for (let i = 1; i < parts.length; i++) {
        const attrPart = parts[i].trim();
        const [attrName, attrValue] = attrPart.split('=');
        const lowerAttrName = attrName.toLowerCase();

        if (lowerAttrName === 'httponly') {
          cookieOptions.httpOnly = true;
        } else if (lowerAttrName === 'secure') {
          cookieOptions.secure = true;
        } else if (lowerAttrName === 'samesite') {
          // Normalize SameSite value: 'none' vs true/false
          const samesiteValue = attrValue.toLowerCase();
          if (samesiteValue === 'none') {
            cookieOptions.sameSite = 'none'; // Explicitly 'none' string
          } else if (samesiteValue === 'lax') {
            cookieOptions.sameSite = 'lax';
          } else if (samesiteValue === 'strict') {
            cookieOptions.sameSite = 'strict';
          }
          // Note: Next.js cookies().set() accepts 'strict' | 'lax' | 'none' | boolean.
          // boolean `true` corresponds to 'Lax'. We're using string values for clarity.
        } else if (lowerAttrName === 'path') {
          cookieOptions.path = attrValue;
        } else if (lowerAttrName === 'expires') {
          cookieOptions.expires = new Date(attrValue);
        } else if (lowerAttrName === 'max-age') {
          cookieOptions.maxAge = parseInt(attrValue, 10);
        } else if (lowerAttrName === 'domain') {
          cookieOptions.domain = attrValue;
        }
        // Add other attributes if your backend sends them and you need to forward them.
      }

      parsedCookies.push({
        name: cookieName,
        value: cookieValue,
        options: cookieOptions,
      });
    } catch (error) {
      console.error(`Error parsing cookie string "${cookieString}":`, error);
      // Decide if you want to push partial data or skip on error.
      // For now, we'll just log and skip this problematic cookie.
    }
  });

  return parsedCookies;
}
