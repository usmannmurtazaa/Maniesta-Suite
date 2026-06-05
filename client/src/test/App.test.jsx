import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Maniesta brand text', () => {
  render(<App />);
  const linkElement = screen.getByText(/maniesta/i);
  expect(linkElement).toBeInTheDocument();
});