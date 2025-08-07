import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CaretRight, House, GraduationCap } from '@phosphor-icons/react';

function CourseBreadcrumb({ course }) {
  const breadcrumbs = [
    { name: 'Início', url: '/', icon: House },
    { name: 'Cursos', url: '/#cursos' },
    { name: course.basicInfo.title, url: `/cursos/${course.basicInfo.slug}`, current: true },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const IconComponent = item.icon;

            return (
              <div key={item.name} className="flex items-center">
                
                {/* Breadcrumb Item */}
                {isLast ? (
                  <span 
                    className="font-medium flex items-center gap-1"
                    style={{ color: course.themeColors.primary }}
                    aria-current="page"
                  >
                    {IconComponent && <IconComponent size={16} weight="duotone" />}
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={item.url}
                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    {IconComponent && <IconComponent size={16} weight="duotone" />}
                    {item.name}
                  </Link>
                )}

                {/* Separator */}
                {!isLast && (
                  <CaretRight size={14} className="text-gray-600 mx-2" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Quick Course Info */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <span 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: course.themeColors.primary }}
            />
            {course.basicInfo.category}
          </div>
          <div>•</div>
          <div>{course.basicInfo.level}</div>
          <div>•</div>
          <div>{course.basicInfo.duration}</div>
          {course.basicInfo.certificate && (
            <>
              <div>•</div>
              <div className="flex items-center gap-1">
                <GraduationCap size={16} weight="duotone" className="text-purple-400" />
                Certificado
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

CourseBreadcrumb.propTypes = {
  course: PropTypes.shape({
    basicInfo: PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      certificate: PropTypes.bool.isRequired,
    }).isRequired,
    themeColors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CourseBreadcrumb; 