import { render, screen } from '@testing-library/react-native';

import SignInScreen from '@/app/sign-in';

jest.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: { auth: {} },
}));

describe('SignInScreen', () => {
  it('shows a setup hint when Supabase is not configured', async () => {
    await render(<SignInScreen />);

    expect(screen.getByTestId('config-hint')).toBeOnTheScreen();
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
  });
});
