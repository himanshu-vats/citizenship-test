# Blog Article Generator Script

## Quick Start

### 1. Install Dependencies
```bash
npm install openai
```

### 2. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key

### 3. Set Environment Variable
```bash
# On Mac/Linux:
export OPENAI_API_KEY="sk-your-key-here"

# Or add to .env.local file:
echo "OPENAI_API_KEY=sk-your-key-here" >> .env.local
```

### 4. Generate an Article
```bash
node scripts/generate-article.js "Your article topic here"
```

## Examples

```bash
# Generate article about N-400 processing times
node scripts/generate-article.js "How long does N-400 processing take in 2025?"

# Generate article about interview prep
node scripts/generate-article.js "10 tips for passing your citizenship interview"

# Generate article about specific question
node scripts/generate-article.js "What is the Bill of Rights? Question 8 explained"
```

## What It Does

1. ✅ Calls OpenAI API with your topic
2. ✅ Generates complete article with frontmatter
3. ✅ Saves to `content/blog/filename.md`
4. ✅ Shows preview
5. ✅ Gives you next steps to publish

## Cost

- **GPT-4o-mini**: ~$0.02 per article (super cheap!)
- **GPT-4**: ~$0.10 per article (higher quality)

## Batch Generation

Create multiple articles at once:

```bash
# Create a topics file
cat > topics.txt << EOF
How to check N-400 case status online
What happens if I fail the civics test?
Understanding the naturalization timeline
Common N-400 application mistakes to avoid
EOF

# Generate each article
while read topic; do
  node scripts/generate-article.js "$topic"
  sleep 2  # Wait between API calls
done < topics.txt
```

## Troubleshooting

**"OPENAI_API_KEY not set"**
- Make sure you exported the environment variable
- Or add to .env.local file

**"OpenAI API error"**
- Check your API key is valid
- Check you have credits in your OpenAI account
- Check your internet connection

**Article quality isn't great**
- Edit the systemPrompt in generate-article.js
- Switch to gpt-4 model (line 84)
- Regenerate with more specific topic

## Advanced Usage

### Custom Model
Edit line 84 in `generate-article.js`:
```javascript
model: 'gpt-4', // Higher quality, more expensive
```

### Custom Prompt
Edit the `systemPrompt` variable to change writing style, tone, or structure.

### Review Before Publishing
```bash
# Generate article
node scripts/generate-article.js "Your topic"

# Review in your editor
code content/blog/your-topic.md

# Make edits if needed

# Publish
git add content/blog/your-topic.md
git commit -m "Add article: Your topic"
git push
```

## Cost Estimation

| Articles/Month | Cost (GPT-4o-mini) | Cost (GPT-4) |
|----------------|-------------------|--------------|
| 10             | $0.20             | $1.00        |
| 50             | $1.00             | $5.00        |
| 100            | $2.00             | $10.00       |

## Next Steps

Once you're comfortable with this:
1. Set up the GitHub Actions workflow (see `.github/workflows/generate-blog.yml.example`)
2. Fully automate with topic lists
3. Schedule daily article generation
