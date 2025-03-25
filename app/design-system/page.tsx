'use client'

import { designSystemUtils, themeColors } from '@/lib/design-system'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'

const DesignSystemPage = () => {
  return (
    <div className={`min-h-screen ${themeColors.bg.secondary}`}>
      <div className={designSystemUtils.layout.container}>
        <div className={designSystemUtils.spacing.section}>
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className={designSystemUtils.text.h1}>Design System</h1>
            <p className={`mx-auto mt-4 max-w-2xl ${designSystemUtils.text.muted}`}>
              A comprehensive design system built with Tailwind CSS for consistent, beautiful, and
              accessible components.
            </p>
          </div>

          {/* Colors Section */}
          <section className="mb-16">
            <h2 className={designSystemUtils.text.h2}>Colors</h2>
            <div className={designSystemUtils.layout.grid['4']}>
              {Object.entries({
                primary: 'Primary',
                secondary: 'Secondary',
                accent: 'Accent',
                success: 'Success',
                warning: 'Warning',
                error: 'Error',
              }).map(([key, label]) => (
                <Card key={key} variant="default">
                  <CardHeader>
                    <CardTitle className="capitalize">{label}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <div key={shade} className="flex items-center justify-between">
                        <span className="text-sm">{shade}</span>
                        <div
                          className={`h-8 w-8 rounded border ${key === 'primary' ? 'bg-primary-' + shade : key === 'secondary' ? 'bg-secondary-' + shade : key === 'accent' ? 'bg-accent-' + shade : key === 'success' ? 'bg-success-' + shade : key === 'warning' ? 'bg-warning-' + shade : 'bg-error-' + shade}`}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Typography Section */}
          <section className="mb-16">
            <h2 className={designSystemUtils.text.h2}>Typography</h2>
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <h1 className={designSystemUtils.text.h1}>Heading 1</h1>
                  <p className="text-sm text-secondary-500">designSystemUtils.text.h1</p>
                </div>
                <div>
                  <h2 className={designSystemUtils.text.h2}>Heading 2</h2>
                  <p className="text-sm text-secondary-500">designSystemUtils.text.h2</p>
                </div>
                <div>
                  <h3 className={designSystemUtils.text.h3}>Heading 3</h3>
                  <p className="text-sm text-secondary-500">designSystemUtils.text.h3</p>
                </div>
                <div>
                  <h4 className={designSystemUtils.text.h4}>Heading 4</h4>
                  <p className="text-sm text-secondary-500">designSystemUtils.text.h4</p>
                </div>
                <div>
                  <p className={designSystemUtils.text.body}>Body text with relaxed line height</p>
                  <p className="text-sm text-secondary-500">designSystemUtils.text.body</p>
                </div>
                <div>
                  <p className={designSystemUtils.text.small}>Small text</p>
                  <p className="text-sm text-secondary-500">designSystemUtils.text.small</p>
                </div>
                <div>
                  <p className={designSystemUtils.text.muted}>Muted text</p>
                  <p className="text-sm text-secondary-500">designSystemUtils.text.muted</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Buttons Section */}
          <section className="mb-16">
            <h2 className={designSystemUtils.text.h2}>Buttons</h2>
            <Card>
              <CardContent className="space-y-6">
                <div>
                  <h3 className={designSystemUtils.text.h3}>Variants</h3>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                  </div>
                </div>
                <div>
                  <h3 className={designSystemUtils.text.h3}>Sizes</h3>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Cards Section */}
          <section className="mb-16">
            <h2 className={designSystemUtils.text.h2}>Cards</h2>
            <div className={designSystemUtils.layout.grid['3']}>
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>This is a default card variant</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card content goes here with some sample text to demonstrate the layout.</p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                  <CardDescription>This card has elevated shadow</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card content goes here with some sample text to demonstrate the layout.</p>
                </CardContent>
              </Card>

              <Card variant="interactive">
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>This card has hover effects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card content goes here with some sample text to demonstrate the layout.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Badges Section */}
          <section className="mb-16">
            <h2 className={designSystemUtils.text.h2}>Badges</h2>
            <Card>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="accent">Accent</Badge>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Inputs Section */}
          <section className="mb-16">
            <h2 className={designSystemUtils.text.h2}>Inputs</h2>
            <div className={designSystemUtils.layout.grid['2']}>
              <Card>
                <CardHeader>
                  <CardTitle>Input Variants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input label="Default Input" placeholder="Enter text..." />
                  <Input
                    label="Error Input"
                    variant="error"
                    placeholder="Error state"
                    error="This field is required"
                  />
                  <Input
                    label="Success Input"
                    variant="success"
                    placeholder="Success state"
                    helperText="Input is valid"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Input Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input label="Email" type="email" placeholder="your@email.com" />
                  <Input label="Password" type="password" placeholder="Enter password" />
                  <Input label="Disabled" disabled placeholder="Disabled input" />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Layout Utilities */}
          <section className="mb-16">
            <h2 className={designSystemUtils.text.h2}>Layout Utilities</h2>
            <Card>
              <CardHeader>
                <CardTitle>Grid Layouts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className={designSystemUtils.text.h3}>2 Column Grid</h3>
                  <div className={designSystemUtils.layout.grid['2']}>
                    <div className="flex h-20 items-center justify-center rounded bg-primary-100">
                      Column 1
                    </div>
                    <div className="flex h-20 items-center justify-center rounded bg-primary-100">
                      Column 2
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className={designSystemUtils.text.h3}>3 Column Grid</h3>
                  <div className={designSystemUtils.layout.grid['3']}>
                    <div className="flex h-20 items-center justify-center rounded bg-secondary-100">
                      Column 1
                    </div>
                    <div className="flex h-20 items-center justify-center rounded bg-secondary-100">
                      Column 2
                    </div>
                    <div className="flex h-20 items-center justify-center rounded bg-secondary-100">
                      Column 3
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className={designSystemUtils.text.h3}>4 Column Grid</h3>
                  <div className={designSystemUtils.layout.grid['4']}>
                    <div className="flex h-20 items-center justify-center rounded bg-accent-100">
                      Col 1
                    </div>
                    <div className="flex h-20 items-center justify-center rounded bg-accent-100">
                      Col 2
                    </div>
                    <div className="flex h-20 items-center justify-center rounded bg-accent-100">
                      Col 3
                    </div>
                    <div className="flex h-20 items-center justify-center rounded bg-accent-100">
                      Col 4
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

export default DesignSystemPage
