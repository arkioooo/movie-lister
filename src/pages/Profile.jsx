// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile, updateUserProfile } from '../api/firestore';

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
];

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    displayName: '',
    preferredType: 'movie',
    preferredLanguage: 'en',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setErr(null);
      try {
        const prof = await getUserProfile(user.uid);
        if (!mounted) return;
        setProfile(prof);
        setForm({
          displayName: (prof && prof.displayName) || user.displayName || '',
          preferredType: (prof && prof.preferredType) || 'movie',
          preferredLanguage: (prof && prof.preferredLanguage) || 'en',
        });
      } catch (e) {
        if (!mounted) return;
        console.error('Failed to load profile', e);
        setErr('Failed to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (!authLoading) load();
    return () => { mounted = false; };
  }, [user, authLoading]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setErr(null);
    setSaved(false);
    try {
      await updateUserProfile(user.uid, {
        displayName: form.displayName || null,
        preferredType: form.preferredType,
        preferredLanguage: form.preferredLanguage,
      });
      setSaved(true);
    } catch (e) {
      console.error('Failed to save profile', e);
      setErr('Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return <div style={{ padding: 20 }}>Loading profile...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        Please <a href="/login">log in</a> to view your profile.
      </div>
    );
  }

  const createdAt = profile && profile.createdAt && profile.createdAt.toDate
    ? profile.createdAt.toDate().toLocaleDateString()
    : null;

  return (
    <div className="profile-layout">
      <div className="card-elevated">
        <div className="card-section-title">Account</div>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.uid}</p>
        {createdAt && <p><strong>Joined:</strong> {createdAt}</p>}
      </div>

      <div className="card-elevated">
        <div className="card-section-title">Preferences</div>

        {err && <div style={{ color: 'red', marginBottom: 8 }}>{err}</div>}
        {saved && <div style={{ color: 'green', marginBottom: 8 }}>Profile updated.</div>}

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label" htmlFor="displayName">
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              name="displayName"
              className="input"
              value={form.displayName}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="preferredType">
              Preferred type
            </label>
            <select
              id="preferredType"
              name="preferredType"
              className="select"
              value={form.preferredType}
              onChange={handleChange}
            >
              <option value="movie">Movies</option>
              <option value="tv">TV shows</option>
            </select>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="preferredLanguage">
              Preferred language
            </label>
            <select
              id="preferredLanguage"
              name="preferredLanguage"
              className="select"
              value={form.preferredLanguage}
              onChange={handleChange}
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>{opt.label}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
