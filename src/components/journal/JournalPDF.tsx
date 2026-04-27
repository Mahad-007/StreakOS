import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { CYCLES } from '@/lib/constants';

// Disable hyphenation to avoid font lookup issues
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  // Title page
  titlePage: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 60,
    backgroundColor: '#0A0E1A',
  },
  titleMain: {
    fontSize: 36,
    fontFamily: 'Times-Bold',
    color: '#FF6B2C',
    marginBottom: 12,
    textAlign: 'center',
  },
  titleSub: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 6,
  },
  titleAuthor: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#F1F5F9',
    marginTop: 30,
    textAlign: 'center',
  },
  titleDivider: {
    width: 80,
    height: 2,
    backgroundColor: '#FF6B2C',
    marginVertical: 24,
  },
  titleQuote: {
    fontSize: 10,
    fontFamily: 'Times-Italic',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 40,
    maxWidth: 300,
  },

  // Entry pages
  entryPage: {
    padding: 50,
    paddingTop: 60,
    paddingBottom: 60,
    backgroundColor: '#FFFDF9',
  },

  // Cycle header
  cycleHeader: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#FF6B2C',
  },
  cycleTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#FF6B2C',
    marginBottom: 3,
  },
  cycleTheme: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#94A3B8',
  },

  // Journal entry
  entryContainer: {
    marginBottom: 22,
    paddingBottom: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
  },
  entryDate: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  entryContent: {
    fontSize: 11,
    fontFamily: 'Times-Roman',
    color: '#1E293B',
    lineHeight: 1.7,
  },

  // Page number
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#94A3B8',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
  },

  // Footer line
  footerLine: {
    position: 'absolute',
    bottom: 45,
    left: 50,
    right: 50,
    height: 0.5,
    backgroundColor: '#E2E8F0',
  },
});

function formatEntryDate(dayNumber: number, entryDate: string): string {
  const date = new Date(entryDate + 'T00:00:00');
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  return `Day ${dayNumber}  ·  ${date.toLocaleDateString('en-US', options)}`;
}

interface JournalPDFProps {
  entries: JournalEntry[];
  userName: string;
}

export function JournalPDFDocument({ entries, userName }: JournalPDFProps) {
  // Group entries by cycle
  const groupedByCycle = CYCLES.map((cycle) => ({
    cycle,
    entries: entries.filter(
      (e) => e.day_number >= cycle.start_day && e.day_number <= cycle.end_day
    ),
  })).filter((group) => group.entries.length > 0);

  return (
    <Document title="My 100-Day Journal" author={userName}>
      {/* Title Page */}
      <Page size="A4" style={styles.titlePage}>
        <Text style={styles.titleMain}>My 100-Day Journal</Text>
        <View style={styles.titleDivider} />
        <Text style={styles.titleSub}>100 Days of Success</Text>
        <Text style={styles.titleSub}>April 27 — August 4, 2026</Text>
        <Text style={styles.titleAuthor}>{userName}</Text>
        <Text style={styles.titleQuote}>
          &quot;These 100 days will decide the next 10 years of our lives.&quot;
        </Text>
      </Page>

      {/* Entry Pages */}
      {groupedByCycle.map(({ cycle, entries: cycleEntries }) => (
        <Page key={cycle.id} size="A4" style={styles.entryPage} wrap>
          {/* Cycle header */}
          <View style={styles.cycleHeader} fixed>
            <Text style={styles.cycleTitle}>
              Cycle {cycle.id}: {cycle.title}
            </Text>
            <Text style={styles.cycleTheme}>{cycle.theme}</Text>
          </View>

          {/* Entries */}
          {cycleEntries.map((entry) => (
            <View key={entry.id} style={styles.entryContainer} wrap={false}>
              <Text style={styles.entryDate}>
                {formatEntryDate(entry.day_number, entry.entry_date)}
              </Text>
              <Text style={styles.entryContent}>
                {entry.journal_content}
              </Text>
            </View>
          ))}

          {/* Page number */}
          <View style={styles.footerLine} fixed />
          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) => `${pageNumber}`}
            fixed
          />
        </Page>
      ))}
    </Document>
  );
}
