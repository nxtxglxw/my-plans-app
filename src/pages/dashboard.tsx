import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 現在のユーザーを取得
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        // 未ログイン → /login にリダイレクト
        router.push('/login');
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    getUser();
  }, [router]);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>ダッシュボード</h1>
      <p>ようこそ、{user?.email} さん！</p>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/login');
        }}
      >
        ログアウト
      </button>
    </div>
  );
}