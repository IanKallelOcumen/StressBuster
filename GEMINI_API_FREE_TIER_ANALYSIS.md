# 🤖 Gemini API Free Tier Analysis

## ✅ **Current Status: FREE TIER COMPATIBLE**

Your app uses **Gemini API** (separate from Firebase) which has its own free tier with generous limits.

---

## 📊 **Current Usage in Your App**

### **Models Used:**
- **Primary**: `gemini-1.5-flash` ✅ (Free tier available)
- **Fallback**: `gemini-pro` ✅ (Free tier available)

### **API Calls Per User Action:**

1. **Chat Message** (`send()` function):
   - **2 API calls** per message:
     - 1 call for mood detection (`detectMoodFromText`)
     - 1 call for chat response (`generateContent`)
   - **Cost**: 5 tokens (in-app currency)

2. **Zen Tip** (`getZenTip()` function):
   - **1 API call** per tip request
   - **Cost**: 2 tokens (in-app currency)

3. **Diagnostics** (Dev mode only):
   - **1 API call** per diagnostic run
   - **Usage**: Developer/admin only

---

## 🆓 **Gemini API Free Tier Limits (2025-2026)**

### **Rate Limits (Per Google Cloud Project):**

| Model | Requests/Minute | Requests/Day | Tokens/Minute |
|-------|----------------|--------------|---------------|
| **Gemini 2.5 Flash** | 10 RPM | 250 RPD | 250,000 TPM |
| **Gemini 2.5 Pro** | 5 RPM | 100 RPD | 250,000 TPM |
| **Flash-Lite** | 15 RPM | 1,000 RPD | 250,000 TPM |

**Note**: Your app uses `gemini-1.5-flash` which likely has similar or better limits than 2.5 Flash.

### **Context Window:**
- **1 million tokens** available on free tier ✅

### **Important Changes:**
- Google reduced free tier quotas by **50-80%** on December 7, 2025
- Daily quotas reset at **midnight Pacific Time**
- Limits apply **per Google Cloud project** (not per API key)

---

## 📈 **Usage Estimates for Your App**

### **Scenario: 100 Active Users**

**Per User Per Day:**
- Average 5 chat messages/day
- Average 2 Zen tips/day
- **Total API calls**: (5 × 2) + 2 = **12 calls/user/day**

**Total Daily Usage:**
- **API Calls**: 100 users × 12 calls = **1,200 calls/day**
- **Free Tier Limit**: 250 calls/day (Gemini 2.5 Flash)
- **Status**: ⚠️ **EXCEEDS FREE TIER** (4.8x over limit)

### **Scenario: 20 Active Users** (More Realistic)

**Per User Per Day:**
- Average 5 chat messages/day
- Average 2 Zen tips/day
- **Total API calls**: (5 × 2) + 2 = **12 calls/user/day**

**Total Daily Usage:**
- **API Calls**: 20 users × 12 calls = **240 calls/day**
- **Free Tier Limit**: 250 calls/day
- **Status**: ✅ **WITHIN FREE TIER** (96% of limit)

---

## 💰 **Pricing (If Exceeding Free Tier)**

### **Token-Based Pricing:**

| Model | Input Tokens | Output Tokens |
|-------|--------------|---------------|
| **Flash-Lite** | $0.10 per 1M | $0.40 per 1M |
| **Gemini 1.5 Flash** | ~$0.075 per 1M | ~$0.30 per 1M |
| **Gemini Pro** | $0.50 per 1M | $1.50 per 1M |

### **Estimated Costs:**

**For 100 users (1,200 calls/day):**
- Average tokens per call: ~500 tokens
- Daily tokens: 1,200 × 500 = **600,000 tokens/day**
- Monthly tokens: 600k × 30 = **18M tokens/month**
- **Cost**: ~$1.35/month (using Flash model)

**For 20 users (240 calls/day):**
- Daily tokens: 240 × 500 = **120,000 tokens/day**
- Monthly tokens: 120k × 30 = **3.6M tokens/month**
- **Cost**: ~$0.27/month (well within free tier)

---

## ⚠️ **Potential Issues & Solutions**

### **Issue 1: Rate Limiting**
**Problem**: If you exceed 10 requests/minute, API calls will fail.

**Solution**: Implement request queuing/throttling:
```javascript
// Add rate limiting
const requestQueue = [];
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 6000; // 6 seconds (10 RPM = 1 per 6s)

const throttledGenerateContent = async (model, prompt) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return await model.generateContent(prompt);
};
```

### **Issue 2: Daily Quota Exceeded**
**Problem**: If you exceed 250 requests/day, API stops working until next day.

**Solution**: 
1. Add quota tracking
2. Show user-friendly error messages
3. Implement fallback responses when quota exceeded

### **Issue 3: Optimize API Calls**
**Current**: 2 API calls per chat message (mood + response)

**Optimization Options**:
1. **Combine prompts**: Ask Gemini to do both mood detection and response in one call
2. **Cache mood detection**: Only detect mood every 3-5 messages
3. **Client-side mood detection**: Use simple keyword matching for basic moods

---

## ✅ **Optimization Recommendations**

### **1. Combine Mood Detection with Chat Response**
```javascript
const prompt = `You are Zen, a mental health companion. 
Analyze the user's mood from their message and respond accordingly.

User Message: "${textToSend}"

Return JSON: { "mood": { "emoji": "...", "label": "...", "confidence": 0.5 }, "response": "..." }`;
```

**Benefit**: Reduces 2 API calls → 1 API call (50% reduction)

### **2. Implement Caching**
- Cache mood detection results for similar messages
- Cache Zen tips (rotate daily)
- Reduce redundant API calls

### **3. Use Flash-Lite Model**
- Switch to `gemini-flash-lite` for mood detection
- Higher free tier limits (1,000 RPD vs 250 RPD)
- Lower cost if exceeding free tier

### **4. Add Rate Limiting**
- Implement client-side rate limiting
- Queue requests if rate limit approached
- Show user-friendly messages

---

## 📊 **Free Tier Compatibility Summary**

### **For Small Scale (< 25 users):**
- ✅ **Fully compatible** with free tier
- ✅ No cost concerns
- ✅ Well within limits

### **For Medium Scale (25-50 users):**
- ⚠️ **May exceed** daily limits occasionally
- 💡 Implement optimizations above
- 💰 Low cost if exceeding (~$0.50-2/month)

### **For Large Scale (50+ users):**
- ❌ **Will exceed** free tier regularly
- 💰 Estimated cost: $1-5/month
- 💡 Consider optimizations or paid tier

---

## 🎯 **Action Items**

1. **Monitor Usage**: Track API calls per day
2. **Implement Rate Limiting**: Prevent 429 errors
3. **Optimize API Calls**: Combine mood + response
4. **Add Fallbacks**: Handle quota exceeded gracefully
5. **Consider Flash-Lite**: For higher free tier limits

---

## 💡 **Quick Wins**

### **Immediate Optimizations:**
1. ✅ Combine mood detection + chat response (saves 50% API calls)
2. ✅ Add request throttling (prevents rate limit errors)
3. ✅ Cache Zen tips (reduces redundant calls)
4. ✅ Use Flash-Lite for mood detection (higher limits)

### **Expected Impact:**
- **Before**: 2 API calls per chat message
- **After**: 1 API call per chat message
- **Savings**: 50% reduction in API usage
- **New Capacity**: ~40-50 users on free tier (vs 20 users)

---

## 📝 **Summary**

**Current Status**: ✅ **Free tier compatible** for < 25 active users

**Main Concern**: Daily request limit (250/day) may be exceeded with > 25 users

**Recommendation**: 
1. Implement optimizations (combine API calls)
2. Add rate limiting
3. Monitor usage
4. Consider Flash-Lite model for higher limits

**Cost if Exceeding**: Very low (~$0.50-2/month for typical usage)

**Bottom Line**: Gemini API is **very affordable** even if you exceed free tier! 🎉
