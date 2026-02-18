-- ============================================
-- PUSH NOTIFICATION TRIGGER
-- ============================================
-- Fires on INSERT into notifications table,
-- builds a push payload, and calls the send-push
-- Edge Function via pg_net HTTP extension.
-- ============================================

-- Enable pg_net extension (HTTP calls from Postgres)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- ============================================
-- Function: send push notification via Edge Function
-- ============================================

CREATE OR REPLACE FUNCTION send_push_notification()
RETURNS TRIGGER AS $$
DECLARE
  _title TEXT;
  _body TEXT;
  _url TEXT;
  _tag TEXT;
  _actor_name TEXT;
  _badge_name TEXT;
  _location_name TEXT;
  _flavor_name TEXT;
  _supabase_url TEXT;
  _service_role_key TEXT;
BEGIN
  -- Get Supabase URL from environment (set via vault or default)
  _supabase_url := current_setting('app.settings.supabase_url', true);
  _service_role_key := current_setting('app.settings.service_role_key', true);

  -- If settings aren't configured, skip silently
  IF _supabase_url IS NULL OR _service_role_key IS NULL THEN
    RETURN NEW;
  END IF;

  -- Look up actor display name
  IF NEW.actor_id IS NOT NULL THEN
    SELECT COALESCE(display_name, username) INTO _actor_name
    FROM profiles WHERE id = NEW.actor_id;
  END IF;

  -- Look up badge name
  IF NEW.badge_id IS NOT NULL THEN
    SELECT name INTO _badge_name FROM badges WHERE id = NEW.badge_id;
  END IF;

  -- Look up location name
  IF NEW.location_id IS NOT NULL THEN
    SELECT name INTO _location_name FROM locations WHERE id = NEW.location_id;
  END IF;

  -- Look up flavor name
  IF NEW.flavor_id IS NOT NULL THEN
    SELECT name INTO _flavor_name FROM flavors WHERE id = NEW.flavor_id;
  END IF;

  -- Build notification content based on type
  CASE NEW.type
    WHEN 'follow' THEN
      _title := 'New Follower';
      _body := COALESCE(_actor_name, 'Someone') || ' started following you';
      _url := '/notifications';
      _tag := 'follow-' || NEW.actor_id;

    WHEN 'like' THEN
      _title := 'New Like';
      _body := COALESCE(_actor_name, 'Someone') || ' liked your check-in';
      _url := '/notifications';
      _tag := 'like-' || COALESCE(NEW.checkin_id::text, NEW.id::text);

    WHEN 'comment' THEN
      _title := 'New Comment';
      _body := COALESCE(_actor_name, 'Someone') || ' commented on your check-in';
      _url := '/notifications';
      _tag := 'comment-' || COALESCE(NEW.checkin_id::text, NEW.id::text);

    WHEN 'badge' THEN
      _title := 'Badge Earned!';
      _body := 'You earned the ' || COALESCE(_badge_name, 'new') || ' badge!';
      _url := '/profile';
      _tag := 'badge-' || COALESCE(NEW.badge_id::text, NEW.id::text);

    WHEN 'claim' THEN
      _title := 'Business Claim Update';
      _body := 'Your business claim has been reviewed';
      _url := '/dashboard';
      _tag := 'claim';

    WHEN 'alert' THEN
      _title := 'Flavor Alert!';
      _body := COALESCE(_flavor_name, 'A tracked flavor') || ' was spotted at ' || COALESCE(_location_name, 'a shop near you');
      _url := '/alerts';
      _tag := 'alert-' || COALESCE(NEW.flavor_id::text, NEW.id::text);

    ELSE
      _title := 'Scooped';
      _body := 'You have a new notification';
      _url := '/notifications';
      _tag := 'general';
  END CASE;

  -- Call the Edge Function via pg_net
  PERFORM net.http_post(
    url := _supabase_url || '/functions/v1/send-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || _service_role_key
    ),
    body := jsonb_build_object(
      'user_id', NEW.user_id,
      'title', _title,
      'body', _body,
      'url', _url,
      'tag', _tag
    )
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't block notification creation if push fails
    RAISE WARNING 'Push notification trigger error: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Trigger: fire on notification insert
-- ============================================

DROP TRIGGER IF EXISTS trg_push_notification ON notifications;

CREATE TRIGGER trg_push_notification
  AFTER INSERT ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION send_push_notification();
