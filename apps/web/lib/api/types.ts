export interface ResponseMeta {
  request_id: string;
  timestamp: string;
}

export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: ResponseMeta;
}

export interface PaginationMeta {
  total_items: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
  meta: ResponseMeta;
}

export interface AuthSession {
  authenticated: boolean;
  user: UserProfile | null;
}

export interface UserPreference {
  preferred_theme: string;
  default_event_type?: string;
  email_notifications: boolean;
}

export interface UserSession {
  id: string;
  device_info: string;
  ip_address: string;
  created_at: string;
  expires_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  occupation?: string;
  country?: string;
  timezone?: string;
  is_active: boolean;
  is_verified: boolean;
  onboarding_completed: boolean;
  preference?: UserPreference;
  created_at: string;
}


export interface EventContext {
  id: string;
  journey_id: string;
  event_type: string;
  name?: string;
  industry?: string;
  dress_code: string;
  target_vibe: string;
  event_date?: string;
  location?: string;
  created_at: string;
}

export interface Journey {
  id: string;
  user_id: string;
  title: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'ANALYZING' | 'COMPLETED' | 'FAILED' | 'ARCHIVED';
  current_step?: number;
  active_presence_index?: number | null;
  presence_score?: number;
  executive_vibe_score?: number;
  visual_impact_score?: number;
  grooming_score?: number;
  outfit_alignment_score?: number;
  event?: EventContext;
  created_at: string;
  updated_at: string;
}

export interface SelfieUpload {
  id: string;
  journey_id: string;
  file_url: string;
  file_size_bytes: number;
  mime_type: string;
  processing_status: 'PENDING' | 'COMPLETED' | 'FAILED';
  created_at: string;
}

export interface OutfitUpload {
  id: string;
  journey_id: string;
  file_url: string;
  display_order: number;
  is_selected: boolean;
  created_at: string;
}

export interface Recommendation {
  id: string;
  category: 'VIBE' | 'GROOMING' | 'OUTFIT' | 'BEHAVIOR';
  title: string;
  description: string;
  impact_level: 'HIGH' | 'MEDIUM' | 'LOW';
  actionable_step: string;
}

export interface PreparationChecklist {
  id: string;
  timeframe: string;
  task: string;
  is_completed: boolean;
  display_order: number;
}

export interface PresencePlan {
  id: string;
  journey_id: string;
  overall_presence_score: number;
  overall_presence_index?: number;
  summary_narrative?: string | null;
  confidence_score?: number;
  executive_vibe_score: number;
  visual_impact_score: number;
  grooming_score: number;
  outfit_alignment_score: number;
  executive_summary: string;
  vibe_analysis: string;
  skin_insights?: Record<string, any>;
  selected_outfit_id?: string;
  recommendations: Recommendation[];
  checklist: PreparationChecklist[];
  created_at: string;
}

export interface DashboardOverview {
  // Backend DTO fields
  active_journey?: Journey | null;
  presence_index_avg?: number;
  completed_journeys_count?: number;
  total_journeys_count?: number;
  recent_plans?: PresencePlan[];
  quick_stats?: Record<string, string>;
  recent_journeys?: Journey[];

  // Legacy / local-fallback aliases (deprecated; never use for user-facing statistics)
  total_journeys?: number;
  average_presence_score?: number;
  highest_score?: number;
  recent_journeys?: Journey[];
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  color: string | null;
  formality: string | null;
  photo_url: string | null;
  wear_count: number;
  is_favorite: boolean;
}

export interface SavedWardrobeLook {
  id: string;
  name: string;
  image_url: string | null;
  journey_id: string | null;
  items: Array<Record<string, unknown>>;
  created_at: string;
}

export interface SavedPlanSummary {
  id: string;
  journey_id: string;
  overall_presence_index: number | null;
  executive_vibe_score: number | null;
  created_at: string | null;
}

export interface RegistrationResult {
  email: string;
  verification_required: true;
}
