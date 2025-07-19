'use client'

import React from 'react'
import { TruncatedText } from './TruncatedText'

/**
 * Example usage of the TruncatedText component
 */
export const TruncatedTextExample: React.FC = () => {
  const longText = 'This is a very long text that should be truncated when it exceeds the maximum length specified by the maxLength prop'
  const shortText = 'Short text'

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">TruncatedText Component Examples</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Basic Usage - Long Text Truncated</h3>
          <div className="p-4 border rounded-lg bg-gray-50">
            <TruncatedText text={longText} maxLength={50} />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Text longer than 50 characters is truncated with ellipsis and shows tooltip on hover
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Short Text - No Truncation</h3>
          <div className="p-4 border rounded-lg bg-gray-50">
            <TruncatedText text={shortText} maxLength={50} />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Text shorter than maxLength is displayed normally without tooltip
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Custom HTML Element (h3)</h3>
          <div className="p-4 border rounded-lg bg-gray-50">
            <TruncatedText 
              text={longText} 
              maxLength={40} 
              as="h3"
              className="text-xl font-bold text-blue-600"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Rendered as h3 element with custom styling
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Custom Tooltip Content</h3>
          <div className="p-4 border rounded-lg bg-gray-50">
            <TruncatedText 
              text={longText} 
              maxLength={30} 
              tooltipContent="This is a custom tooltip message that's different from the original text"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Shows custom tooltip content instead of the full original text
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Tooltip Disabled</h3>
          <div className="p-4 border rounded-lg bg-gray-50">
            <TruncatedText 
              text={longText} 
              maxLength={35} 
              showTooltip={false}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Text is truncated but no tooltip is shown on hover
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Edge Case - Very Short maxLength</h3>
          <div className="p-4 border rounded-lg bg-gray-50">
            <TruncatedText 
              text="Hello World!" 
              maxLength={5}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Very short maxLength still works correctly
          </p>
        </div>
      </div>
    </div>
  )
}

export default TruncatedTextExample