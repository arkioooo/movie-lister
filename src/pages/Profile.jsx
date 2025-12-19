import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../api/firestore';
import { uploadUserAvatar } from '../api/storage';
import useAuth from '../hooks/useAuth';
import Modal from '../components/common/Modal';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';

export default function Profile() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [initialUsername, setInitialUsername] = useState('');
  const [username, setUsername] = useState('');

  const [profile, setProfile] = useState({
    allowAdult: false,
    language: 'en-US',
    photoURL: null,
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        const data = await getUserProfile(user.uid);
        const uname = data?.username || '';

        setInitialUsername(uname);
        setUsername(uname);

        setProfile({
          allowAdult: data?.allowAdult ?? false,
          language: data?.language || 'en-US',
          photoURL: data?.photoURL || null,
        });
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  async function handleSave() {
    if (!user) return;

    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        username: username.trim(),
        allowAdult: profile.allowAdult,
        language: profile.language,
        updatedAt: new Date(),
      });
      setInitialUsername(username.trim());
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setAvatarUploading(true);
    try {
      const url = await uploadUserAvatar(user.uid, file);
      await updateUserProfile(user.uid, { photoURL: url });
      setProfile((prev) => ({ ...prev, photoURL: url }));
    } catch (err) {
      console.error('Avatar upload failed', err);
    } finally {
      setAvatarUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="profile-card">Loading profile…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div className="profile-card">You must be logged in.</div>
      </div>
    );
  }

  const hasChanges = username.trim() !== initialUsername;

  return (
    <div className="profile-page container">
      {/* Header */}
      <div className="profile-header">
        <h1>Profile</h1>
        <p className="profile-subtitle">
          Manage your account, preferences, and activity
        </p>
      </div>

      {/* ===== Account ===== */}
      <section className="profile-card">
        <div className="profile-card-header">
          <h2>Account</h2>
          <button
            className="btn btn-primary btn-small"
            style={{ width: 'fit-content', padding: '0.5em'}}
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>

        <div className="profile-account">
          {/* Avatar */}
          <div className="profile-avatar">
            {profile.photoURL ? (
              <img
                src={profile.photoURL}
                alt="Avatar"
                className="avatar-circle avatar-img"
              />
            ) : (
              <div className="avatar-circle">
                {(username || user.email)[0]?.toUpperCase()}
              </div>
            )}

            <label className="btn btn-secondary btn-small"  style={{padding: '0.5em'}}>
              {avatarUploading ? 'Uploading…' : 'Change avatar'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
                disabled={avatarUploading}
              />
            </label>
          </div>

          {/* Fields */}
          <div className="profile-fields">
            <div className="field-group">
              <label className="field-label">Username</label>
              <input
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={24}
                placeholder="Your username"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Email</label>
              <input className="input" value={user.email} disabled />
            </div>

            <button
              className="btn btn-secondary btn-small"
              style={{ width: 'fit-content', padding: '0.5em'}}
              onClick={() => setShowPasswordModal(true)}
            >
              Change password
            </button>
          </div>
        </div>
      </section>

      {/* ===== Preferences ===== */}
      <section className="profile-card">
        <h2>Preferences</h2>

        <div className="profile-preferences">
          <div className="preference-item">
            <div>
              <div className="preference-title">Age-restricted content</div>
              <div className="preference-desc">
                Allow movies and shows rated for adults
              </div>
            </div>
            <input
              type="checkbox"
              checked={profile.allowAdult}
              onChange={(e) =>
                setProfile((p) => ({ ...p, allowAdult: e.target.checked }))
              }
            />
          </div>

          <div className="preference-item">
            <div>
              <div className="preference-title">Preferred language</div>
              <div className="preference-desc">
                Used for movie titles and descriptions
              </div>
            </div>
            <select
              className="select"
              value={profile.language}
              onChange={(e) =>
                setProfile((p) => ({ ...p, language: e.target.value }))
              }
            >
              <option value="en-US">English (US)</option>
              <option value="hi-IN">Hindi</option>
              <option value="fr-FR">French</option>
            </select>
          </div>
        </div>
      </section>

      {/* ===== Quick links ===== */}
      <section className="profile-card">
        <h2>Quick access</h2>
        <div className="profile-links">
          <Link to="/favourites" className="profile-link-card">
            Favourites
          </Link>
          <Link to="/lists" className="profile-link-card">
            My Lists
          </Link>
        </div>
      </section>

      {/* ===== Lists placeholder ===== */}
      <section className="profile-card">
        <h2>Your lists</h2>
        <div className="profile-lists-placeholder">
          <p>You haven’t created any lists yet.</p>
          <button className="btn btn-secondary" disabled>
            Create list
          </button>
        </div>
      </section>

      {/* ===== Change Password Modal ===== */}
      <Modal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      >
        <ChangePasswordForm
          onClose={() => setShowPasswordModal(false)}
        />
      </Modal>
    </div>
  );
}
