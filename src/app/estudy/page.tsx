'use client';
import s from '@/styles/shared.module.css';

export default function Page() {
  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>eStudy</h1>
          <p className={s.pageDesc}>Upload and manage study materials for students.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>Study Materials</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>No study materials uploaded yet. You can upload PDFs, videos, and assignments for each course batch.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>Supported Formats</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>Supports PDF documents, MP4 videos, DOCX files, and image attachments. Max file size: 50MB per upload.</p>
        </div>
      </div>
    </div>
  );
}
