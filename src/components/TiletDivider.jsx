import ScrollAnimation from './ScrollAnimation';

/**
 * TiletDivider - An elegant Ethiopian geometric separation component.
 * Uses the brand's 'Timkat Cross/Diamond' motif in gold against dark backgrounds.
 * 
 * Variants:
 * - "center" (default): A focal point section separator with fading gradient lines.
 * - "strip": A continuous repeating woven-style border horizontally.
 */
const TiletDivider = ({ variant = 'center', className = '' }) => {
  // Continuous woven strip variant
  if (variant === 'strip') {
    return (
      <div className={`w-full flex justify-center opacity-80 py-4 ${className}`}>
        <div 
          className="w-full h-[14px] border-y border-[#C9A170]/30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='14' viewBox='0 0 44 14'%3E%3Cg fill='none' stroke='%23C9A170' stroke-width='1'%3E%3Cpath d='M0 7 L11 2 L22 7 L11 12 Z M22 7 L33 2 L44 7 L33 12 Z' opacity='0.5'/%3E%3Cpath d='M1 7 L11 3 L21 7 L11 11 Z M23 7 L33 3 L43 7 L33 11 Z' stroke-width='0.5' opacity='0.8'/%3E%3Ccircle cx='11' cy='7' r='1.5' fill='%23C9A170' opacity='0.9' stroke='none'/%3E%3Ccircle cx='33' cy='7' r='1.5' fill='%23C9A170' opacity='0.9' stroke='none'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(13, 31, 19, 0.3)'
          }}
        />
      </div>
    );
  }

  // Centered focal motif variant
  return (
    <ScrollAnimation animation="fadeUp" delay={0.1} duration={0.6}>
      <div className={`w-full flex items-center justify-center py-10 ${className}`}>
        <div className="w-full max-w-[600px] flex items-center gap-3 sm:gap-5 opacity-90 px-4">
          
          {/* Left fading line with subtle glow shadow */}
          <div 
            className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C9A170]/30 to-[#C9A170]/80" 
            style={{ boxShadow: '0 0 8px rgba(201,161,112,0.2)' }}
          />
          
          {/* Tilet center motifs */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[...Array(3)].map((_, i) => {
              const isCenter = i === 1;
              return (
                <svg 
                  key={i}
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-all duration-500 ${isCenter ? 'scale-[1.35] mx-2 sm:mx-3 opacity-100' : 'scale-90 opacity-50'}`}
                  style={{
                    filter: isCenter ? 'drop-shadow(0 0 10px rgba(201,161,112,0.35))' : 'none'
                  }}
                >
                  {/* Outer geometric diamond */}
                  <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="#C9A170" strokeWidth="1" fill={isCenter ? 'rgba(201,161,112,0.08)' : 'transparent'} />
                  
                  {/* Inner woven diamond shape */}
                  <path d="M12 7L17 12L12 17L7 12L12 7Z" stroke="#C9A170" strokeWidth="1.2" opacity="0.85"/>
                  
                  {/* Center accent */}
                  <circle cx="12" cy="12" r="2.5" fill="#C9A170" />
                  
                  {/* Traditional 4 petal dots (Timkat style shape) */}
                  <circle cx="12" cy="2" r="1.5" fill="#E2C49A" />
                  <circle cx="22" cy="12" r="1.5" fill="#E2C49A" />
                  <circle cx="12" cy="22" r="1.5" fill="#E2C49A" />
                  <circle cx="2" cy="12" r="1.5" fill="#E2C49A" />
                </svg>
              );
            })}
          </div>

          {/* Right fading line with subtle glow shadow */}
          <div 
            className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C9A170]/30 to-[#C9A170]/80"
            style={{ boxShadow: '0 0 8px rgba(201,161,112,0.2)' }}
          />
          
        </div>
      </div>
    </ScrollAnimation>
  );
};

export default TiletDivider;
