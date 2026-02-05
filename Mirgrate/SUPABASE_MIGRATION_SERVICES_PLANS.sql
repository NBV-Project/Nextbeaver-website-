-- Add modal_plans to services_items
ALTER TABLE services_items 
ADD COLUMN IF NOT EXISTS modal_plans JSONB DEFAULT '[]'::jsonb;

-- Add granular styles for Pricing Modal elements to services_styles
ALTER TABLE services_styles
-- Plan Title
ADD COLUMN IF NOT EXISTS plan_title_font_family_en TEXT,
ADD COLUMN IF NOT EXISTS plan_title_font_family_th TEXT,
ADD COLUMN IF NOT EXISTS plan_title_font_size INTEGER,
ADD COLUMN IF NOT EXISTS plan_title_color_light TEXT,
ADD COLUMN IF NOT EXISTS plan_title_color_dark TEXT,

-- Plan Description
ADD COLUMN IF NOT EXISTS plan_desc_font_family_en TEXT,
ADD COLUMN IF NOT EXISTS plan_desc_font_family_th TEXT,
ADD COLUMN IF NOT EXISTS plan_desc_font_size INTEGER,
ADD COLUMN IF NOT EXISTS plan_desc_color_light TEXT,
ADD COLUMN IF NOT EXISTS plan_desc_color_dark TEXT,

-- Plan Price
ADD COLUMN IF NOT EXISTS plan_price_font_family_en TEXT,
ADD COLUMN IF NOT EXISTS plan_price_font_family_th TEXT,
ADD COLUMN IF NOT EXISTS plan_price_font_size INTEGER,
ADD COLUMN IF NOT EXISTS plan_price_color_light TEXT,
ADD COLUMN IF NOT EXISTS plan_price_color_dark TEXT,

-- Plan Currency ($)
ADD COLUMN IF NOT EXISTS plan_currency_font_family_en TEXT,
ADD COLUMN IF NOT EXISTS plan_currency_font_family_th TEXT,
ADD COLUMN IF NOT EXISTS plan_currency_font_size INTEGER,
ADD COLUMN IF NOT EXISTS plan_currency_color_light TEXT,
ADD COLUMN IF NOT EXISTS plan_currency_color_dark TEXT,

-- Plan Period (/mo)
ADD COLUMN IF NOT EXISTS plan_period_font_family_en TEXT,
ADD COLUMN IF NOT EXISTS plan_period_font_family_th TEXT,
ADD COLUMN IF NOT EXISTS plan_period_font_size INTEGER,
ADD COLUMN IF NOT EXISTS plan_period_color_light TEXT,
ADD COLUMN IF NOT EXISTS plan_period_color_dark TEXT,

-- Plan CTA Button
ADD COLUMN IF NOT EXISTS plan_cta_font_family_en TEXT,
ADD COLUMN IF NOT EXISTS plan_cta_font_family_th TEXT,
ADD COLUMN IF NOT EXISTS plan_cta_font_size INTEGER,
ADD COLUMN IF NOT EXISTS plan_cta_color_light TEXT,
ADD COLUMN IF NOT EXISTS plan_cta_color_dark TEXT,

-- Plan Badge (Most Popular)
ADD COLUMN IF NOT EXISTS plan_badge_font_family_en TEXT,
ADD COLUMN IF NOT EXISTS plan_badge_font_family_th TEXT,
ADD COLUMN IF NOT EXISTS plan_badge_font_size INTEGER,
ADD COLUMN IF NOT EXISTS plan_badge_color_light TEXT,
ADD COLUMN IF NOT EXISTS plan_badge_color_dark TEXT,

-- Plan Feature Items
ADD COLUMN IF NOT EXISTS plan_feature_font_family_en TEXT,
ADD COLUMN IF NOT EXISTS plan_feature_font_family_th TEXT,
ADD COLUMN IF NOT EXISTS plan_feature_font_size INTEGER,
ADD COLUMN IF NOT EXISTS plan_feature_color_light TEXT,
ADD COLUMN IF NOT EXISTS plan_feature_color_dark TEXT;

-- Update existing items with default plans (Seed)
UPDATE services_items
SET modal_plans = '[
  {
    "title": "The Foundation",
    "description": "For emerging visionaries establishing their digital footprint.",
    "price": "2,500",
    "currency": "$",
    "period": "/mo",
    "cta": "Begin Journey",
    "featureIcon": "check_circle",
    "features": [
      "Custom Design System",
      "React Development",
      "SEO Fundamentals",
      "Standard Animation Suite",
      "CMS Integration"
    ]
  },
  {
    "title": "The Sovereign",
    "description": "The zenith of performance for industry leaders.",
    "price": "5,000",
    "currency": "$",
    "period": "/mo",
    "cta": "Claim Sovereignty",
    "badge": "Most Popular",
    "featured": true,
    "icon": "crown",
    "featureIcon": "verified",
    "features": [
      "3D WebGL Interactions",
      "Headless CMS Architecture",
      "Advanced Analytics Dashboard",
      "Priority Concierge Support",
      "Volumetric Lighting Effects",
      "Multi-Region Deployment"
    ]
  },
  {
    "title": "The Imperial",
    "description": "Unbounded power for global domination.",
    "price": "Custom",
    "cta": "Contact for Empire",
    "featureIcon": "diamond",
    "features": [
      "Dedicated Engineering Squad",
      "AR/VR Immersive Integration",
      "24/7 Global Concierge",
      "Custom AI Implementation",
      "Global CDN Deployment",
      "Bespoke SLA"
    ]
  }
]'::jsonb
WHERE modal_plans IS NULL OR modal_plans = '[]'::jsonb;
