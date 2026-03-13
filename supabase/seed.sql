-- T1D Parent Copilot — Sample Seed Data
-- ⚠️  MVP-ONLY: For local development and demo purposes.
-- Replace UUIDs and adjust values to match your dev Supabase project.
--
-- Usage:
--   1. Create a test user via Supabase Auth (email: demo@example.com)
--   2. Copy that user's UUID into the variables below
--   3. Run in Supabase SQL Editor

-- ─────────────────────────────────────────
-- Replace this with your actual test user UUID from auth.users
-- ─────────────────────────────────────────
do $$
declare
  v_user_id   uuid := '00000000-0000-0000-0000-000000000001'; -- ← replace
  v_child_id  uuid := gen_random_uuid();
begin

  -- ── USER PROFILE ──────────────────────────────────────────────
  insert into public.users (id, email, display_name)
  values (v_user_id, 'demo@example.com', 'Alex (Demo Parent)')
  on conflict (id) do nothing;

  -- ── CHILD PROFILE ─────────────────────────────────────────────
  insert into public.children (id, user_id, name, dob, diagnosis_date)
  values (
    v_child_id,
    v_user_id,
    'Emma',
    '2014-06-15',           -- age ~11
    '2020-03-22'            -- diagnosed ~4 years ago
  );

  -- ── CHILD SETTINGS ────────────────────────────────────────────
  insert into public.child_settings (
    child_id,
    target_range_low,
    target_range_high,
    high_threshold,
    low_threshold,
    pump_type,
    cgm_type,
    insulin_type,
    low_treatment_grams,
    low_treatment_type,
    site_change_days
  ) values (
    v_child_id,
    80,                     -- target low
    160,                    -- target high
    250,                    -- high alert threshold
    70,                     -- low alert threshold
    'Tandem t:slim X2',
    'Dexcom G7',
    'Humalog',
    15,                     -- fast carbs grams
    'juice box',
    3                       -- site change every 3 days
  );

  -- ── CAREGIVER GUIDE ───────────────────────────────────────────
  insert into public.caregiver_guides (
    child_id,
    emergency_contact1_name,
    emergency_contact1_phone,
    emergency_contact1_rel,
    emergency_contact2_name,
    emergency_contact2_phone,
    emergency_contact2_rel,
    doctor_name,
    doctor_phone,
    low_bg_symptoms,
    low_treatment_steps,
    high_bg_steps,
    pump_cgm_notes,
    when_to_call_parent,
    school_notes
  ) values (
    v_child_id,
    'Alex (Parent)',
    '(555) 123-4567',
    'Parent',
    'Jordan (Grandparent)',
    '(555) 987-6543',
    'Grandparent',
    'Dr. Sarah Chen — Pediatric Endocrinology',
    '(555) 456-7890',
    'Shaky hands, pale skin, sweating, confusion, difficulty concentrating, irritability',
    E'1. Stay calm and stay with Emma.\n2. Give 15g fast carbs immediately: 1 juice box OR 4 glucose tabs OR 4 oz regular juice.\n3. Wait 15 minutes — DO NOT give more carbs before then.\n4. Recheck CGM or finger stick after 15 min.\n5. If still below 70, repeat step 2.\n6. Once stable, give a small snack if a meal is not coming soon.\n7. Call parent if BG stays below 70 after 2 rounds of treatment.',
    E'1. Check that the CGM reading is accurate (finger stick if unsure).\n2. Make sure Emma has had water and is not dehydrated.\n3. Check pump site — if redness, swelling, or kinked tubing, call parent immediately.\n4. Call parent if BG is above 300 or if ketones are suspected.\n5. Do NOT give extra insulin without parent direction.',
    E'Pump: Tandem t:slim X2 — Do NOT press any buttons unless Emma guides you.\nCGM: Dexcom G7 on her upper arm. Alarm means check her immediately.\nDo NOT remove pump or sensor.',
    E'• BG below 55 at any time\n• BG stays below 70 after two juice boxes\n• Emma is confused, shaking, or won''t wake up\n• BG is above 300\n• Emma vomits or complains of stomach pain\n• Pump alarm you cannot silence',
    E'Emma knows her condition well and can often direct you. Listen to her.\nHer kit has: glucose tabs, juice boxes, glucagon (red case, use only if she is unconscious).\nSchool nurse: Ms. Rivera, Room 104.'
  );

  -- ── EVENT LOGS (past 7 days sample) ───────────────────────────
  insert into public.event_logs (child_id, user_id, category, note, blood_sugar, logged_at)
  values
    -- Today
    (v_child_id, v_user_id, 'meal',      'Breakfast: oatmeal + banana',    142, now() - interval '2 hours'),
    (v_child_id, v_user_id, 'exercise',  'Soccer practice 45 min',          88, now() - interval '5 hours'),
    -- Yesterday
    (v_child_id, v_user_id, 'high_bg',   'Spike after pizza dinner',       268, now() - interval '1 day'),
    (v_child_id, v_user_id, 'meal',      'Dinner: pizza x2 slices',        null, now() - interval '1 day 30 minutes'),
    (v_child_id, v_user_id, 'low_bg',    'Nighttime low — woke at 2am',     58, now() - interval '22 hours'),
    (v_child_id, v_user_id, 'low_treatment', '1 juice box given',          null, now() - interval '22 hours'),
    -- 3 days ago
    (v_child_id, v_user_id, 'site_change', 'New infusion site — left arm', null, now() - interval '3 days'),
    (v_child_id, v_user_id, 'exercise',  'Dance class 1 hour',              74, now() - interval '3 days 1 hour'),
    -- 5 days ago
    (v_child_id, v_user_id, 'illness',   'Slight cold, runny nose',        198, now() - interval '5 days'),
    (v_child_id, v_user_id, 'stress',    'Big math test today',            215, now() - interval '5 days 3 hours'),
    -- 6 days ago
    (v_child_id, v_user_id, 'meal',      'High-fat meal: tacos',           null, now() - interval '6 days'),
    (v_child_id, v_user_id, 'high_bg',   'Delayed spike ~3hr after tacos', 248, now() - interval '6 days' + interval '3 hours');

end $$;
