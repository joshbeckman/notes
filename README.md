# Josh's Notes

[This site](https://notes.joshbeckman.org) is an export and reformatting of my highlights and notes of my online (and some offline) reading ([script here](https://github.com/joshbeckman/notes/blob/master/utilities/import)).

I use it to jostle loose ideas when I'm researching a particular problem in software design or writing topic. I usually either ask it for a random note or search by keyword.

The site theme is forked from [Simply Jekyll](https://github.com/raghudotcc/simply-jekyll). See the [changelog](https://www.joshbeckman.org/about-this-site#changelog) for recent updates.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/joshbeckman/notes. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

### Submitting code changes:

- Open a Pull Request
- Ensure all CI tests pass
- Await code review

## Development

To set up your environment to develop this site, run `bundle install`.

To import posts from highlight sources, run `./utilities/import`

### Encrypted Posts

Posts can be client-side encrypted so content is only readable with a passphrase. The content is encrypted before commit and decrypted in the browser using the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) with [AES-GCM](https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams) (256-bit) and [PBKDF2](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2) key derivation.

**Setup:**

1. Create `_secrets.yml` (gitignored) with your passphrases:
   ```yaml
   default: "your-secret-passphrase"
   another-key: "different-passphrase"
   ```

2. Add `encrypted: <keyId>` to a post's frontmatter:
   ```yaml
   ---
   title: Private Notes
   encrypted: default
   ---
   Content here will be encrypted.
   ```

3. The pre-commit hook automatically encrypts staged files with `encrypted:` frontmatter.

**Commands:**

```sh
./utilities/encrypt_pages <file>          # Encrypt a file in-place
./utilities/encrypt_pages --decrypt <file> # Print decrypted content
./utilities/encrypt_pages --check          # Verify all key IDs have passphrases
./utilities/encrypt_pages --staged         # Process staged files (used by pre-commit)
```

**Browser behavior:**

Visitors see a passphrase prompt when viewing encrypted pages. By default, passphrases are not cached. Users can enable [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) caching in [Settings > Privacy](/settings#privacy) for convenience (clears when tab closes).
