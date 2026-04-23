export interface CropProfile {
  display_name: string;
  optimal_moisture: [number, number];
  water_need: string;
  nitrogen_need: string;
  overwater_risk: string;
  recommendation_style: string;
}

export const cropProfiles: Record<string, CropProfile> = {
  rice: {
    display_name: "Rice",
    optimal_moisture: [65, 90],
    water_need: "high",
    nitrogen_need: "medium_high",
    overwater_risk: "low",
    recommendation_style: "Rice tolerates wetter soil conditions."
  },
  wheat: {
    display_name: "Wheat",
    optimal_moisture: [45, 65],
    water_need: "medium",
    nitrogen_need: "high",
    overwater_risk: "medium_high",
    recommendation_style: "Avoid waterlogging during wheat growth."
  },
  cotton: {
    display_name: "Cotton",
    optimal_moisture: [40, 60],
    water_need: "medium",
    nitrogen_need: "medium",
    overwater_risk: "high",
    recommendation_style: "Balanced irrigation improves cotton quality."
  },
  sunflower: {
    display_name: "Sunflower",
    optimal_moisture: [35, 55],
    water_need: "low_medium",
    nitrogen_need: "medium",
    overwater_risk: "high",
    recommendation_style: "Sunflower performs better in moderate moisture."
  }
};
