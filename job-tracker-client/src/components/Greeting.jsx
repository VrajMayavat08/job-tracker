import { useAuth } from '../context/AuthContext';

function Greeting() {
  const { user } = useAuth();
  const hour = new Date().getHours();

  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <p className="text-[var(--color-text-secondary)] text-sm">
      {greeting}, {firstName} — let's see what's new
    </p>
  );
}

export default Greeting;