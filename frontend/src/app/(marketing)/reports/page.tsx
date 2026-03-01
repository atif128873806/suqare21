import { FileText, Download, Calendar, MapPin, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Market Reports | Square21 Marketing',
    description: 'Download Square21 Marketing\'s property valuation reports and market analysis for Islamabad real estate sectors.',
};

const reports = [
    {
        id: 1,
        title: 'F-8/3 House Valuation Report',
        description:
            'A comprehensive valuation report for a residential house located in F-8/3, Islamabad. Includes market comparables, property condition assessment, and estimated market value.',
        area: 'F-8/3, Islamabad',
        date: 'February 2025',
        category: 'Residential Valuation',
        file: '/reports/f83-house-valuation-report.pdf',
        pages: 'Professional Report',
    },
];

export default function ReportsPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-primary text-primary-foreground py-16 md:py-24">
                <div className="section-container">
                    <div className="max-w-2xl">
                        <p className="text-secondary text-sm font-semibold tracking-widest uppercase mb-3">
                            Square21 Marketing
                        </p>
                        <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                            Market Reports
                        </h1>
                        <p className="text-white/65 text-base md:text-lg leading-relaxed">
                            Download professional property valuation reports and market analysis documents prepared by our expert team.
                        </p>
                    </div>
                </div>
            </div>

            {/* Reports Grid */}
            <div className="section-container py-16">
                {reports.length === 0 ? (
                    <div className="text-center py-24 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">No reports available yet. Check back soon.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                className="bg-card border border-border/60 rounded-xl p-6 flex flex-col gap-4 hover:border-secondary/40 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Icon + Category */}
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-secondary" />
                                    </div>
                                    <span className="text-xs font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                                        {report.category}
                                    </span>
                                </div>

                                {/* Title & Description */}
                                <div>
                                    <h2 className="font-display font-semibold text-foreground text-lg mb-2 leading-snug">
                                        {report.title}
                                    </h2>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {report.description}
                                    </p>
                                </div>

                                {/* Meta */}
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-auto pt-2 border-t border-border/50">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-secondary/70 shrink-0" />
                                        <span>{report.area}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-secondary/70 shrink-0" />
                                        <span>{report.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-secondary/70 shrink-0" />
                                        <span>{report.pages}</span>
                                    </div>
                                </div>

                                {/* Download Button */}
                                <a
                                    href={report.file}
                                    download
                                    className="mt-2 flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors duration-200"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Report
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-16 bg-muted/40 border border-border/50 rounded-xl p-8 md:p-10 text-center max-w-2xl mx-auto">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                        Need a Valuation for Your Property?
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        Our team provides professional property valuation reports for residential, commercial, and industrial properties across Islamabad's CDA sectors.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors text-sm"
                    >
                        Request a Valuation
                    </Link>
                </div>
            </div>
        </div>
    );
}
