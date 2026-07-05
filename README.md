# Smart Travel Concierge Agent

Built for the Kaggle x Google AI Agents Intensive capstone using vibe coding.

## Workflow
1. **User Input:** The agent first prompts the user for a travel destination and dates.
2. **Browser Search:** Utilizing the browser tool, the agent searches for live weather forecasts for the specified destination and dates.
3. **Data Parsing:** The agent extracts relevant weather data and travel information from the browser results.
4. **Content Generation:** Based on the parsed data, the agent generates a weather-appropriate packing list and a custom 3-day itinerary.
5. **Output Delivery:** The final packing list and itinerary are saved directly into a Markdown file (`MY_TRIP.md`) for the user's convenience.
