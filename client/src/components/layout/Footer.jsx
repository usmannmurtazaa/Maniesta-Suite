import { Link } from 'react-router-dom';
const year = new Date().getFullYear();

const columns = [
  { title: 'Calculators', links: [{ to: '/gpa', label: 'GPA' }, { to: '/cgpa', label: 'CGPA' }, { to: '/calculator', label: 'Scientific' }, { to: '/interest', label: 'Interest' }] },
  { title: 'Converters', links: [{ to: '/converter', label: 'Unit Converter' }] },
  { title: 'Company', links: [{ to: '/about', label: 'About' }, { to: '/contact', label: 'Contact' }] },
];

export default function Footer() {
  return (
    <footer className="glass mt-20 border-t border-white/20 dark:border-white/10">
      <div className="container mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-xl font-bold text-gradient">Maniesta</Link>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Modern academic tools for students worldwide.</p>
          </div>
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold mb-3 text-gray-500 dark:text-gray-400 uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.to}><Link to={link.to} className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200/20 dark:border-gray-700/20 mt-10 pt-6 flex flex-col sm:flex-row justify-between text-xs text-gray-400 dark:text-gray-500">
          <p>© {year} Maniesta Calculator. Built by <a href="https://usmanmurtaza.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-brand-500">Usman Murtaza</a></p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}