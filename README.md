# Josh's Notes

[This site](https://www.joshbeckman.org) is a personal knowledge garden — a public repository of knowledge, research, and writing that serves as both a personal memory aid and a shared resource. See [About This Site](https://www.joshbeckman.org/about-this-site) for more.

The site theme was originally forked from [Simply Jekyll](https://github.com/raghudotcc/simply-jekyll) and has been substantially rewritten over time. See the [changelog](https://www.joshbeckman.org/about-this-site#changelog) for recent updates.

## Project Structure

- `blog/` — Long-form blog articles (Markdown with YAML front matter)
- `notes/` — Short-form notes, highlights, and research
- `replies/` — Cross-posted replies from social networks and other sites
- `exercise/` — Exercise/activity logs
- `assets/` — CSS, JS, images, and static files
- `utilities/` — Ruby scripts for POSSE/PESOS syndication, imports, and site tooling
- `_layouts/`, `_includes/`, `_plugins/`, `_data/` — Jekyll templates and extensions
- `frametags/` — Content taxonomy pages

## Development

To set up your environment to develop this site, run `bundle install`.

The site builds with `bundle exec jekyll build`. Search index is built with `./utilities/build_lunr_index` (Node/Lunr).

To import posts from highlight sources, run `./utilities/import`.

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

## Conventions

- Posts use Markdown with YAML front matter — match the front matter format of sibling files when creating new posts
- All tags in YAML front matter MUST be lowercase alphanumeric with hyphens separating logical words (e.g. `ai` not `AI` and `human-psychology` not `human_psychology`)
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) format
- Prefer editing existing files over creating new ones
- Keep changes minimal and focused
- When drafting or editing blog posts, follow the writing style guide in `llms/prompts/tone.txt`
- Do not modify `_config.yml` or workflow files in `.github/workflows/` unless specifically asked

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/joshbeckman/notes. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

### Submitting code changes:

- Open a Pull Request
- Ensure all CI tests pass
- Await code review
