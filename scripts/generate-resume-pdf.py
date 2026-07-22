#!/usr/bin/env python3
"""Generate Pete Ghiorse's two-page, ATS-readable public resume."""

from pathlib import Path
import shutil

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
PUBLIC_DIR = ROOT / "public"
OUTPUT_PDF = OUTPUT_DIR / "pete-ghiorse-resume.pdf"
PUBLIC_PDF = PUBLIC_DIR / "resume.pdf"

INK = colors.HexColor("#1e2a48")
BLUE = colors.HexColor("#2b4a87")
MUTED = colors.HexColor("#586185")
RULE = colors.HexColor("#ded7c5")
PALE = colors.HexColor("#f5f1e6")


def register_fonts():
    font_candidates = {
        "ResumeSans": "/System/Library/Fonts/Supplemental/Arial.ttf",
        "ResumeSans-Bold": "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    }
    for name, filename in font_candidates.items():
        candidate = Path(filename)
        if candidate.exists():
            pdfmetrics.registerFont(TTFont(name, str(candidate)))
    regular = "ResumeSans" if "ResumeSans" in pdfmetrics.getRegisteredFontNames() else "Helvetica"
    bold = "ResumeSans-Bold" if "ResumeSans-Bold" in pdfmetrics.getRegisteredFontNames() else "Helvetica-Bold"
    return regular, bold


REGULAR, BOLD = register_fonts()


def paragraph(text, style):
    return Paragraph(text, style)


def bullet(text, styles):
    return Paragraph(f"- {text}", styles["bullet"])


def role(company, title, dates, summary, bullets, styles):
    header = Table(
        [[Paragraph(f"<b>{company}</b> | {title}", styles["role"]), Paragraph(dates, styles["date"])]],
        colWidths=[5.6 * inch, 1.15 * inch],
    )
    header.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    parts = [header, Paragraph(summary, styles["summary"])]
    parts.extend(bullet(item, styles) for item in bullets)
    parts.append(Spacer(1, 7))
    return KeepTogether(parts)


def evidence(title, meta, body, link, styles):
    return KeepTogether([
        Paragraph(title, styles["evidence_title"]),
        Paragraph(meta, styles["evidence_meta"]),
        Paragraph(body, styles["summary"]),
        Paragraph(f'<link href="{link}" color="#2b4a87">{link.replace("https://", "")}</link>', styles["link"]),
        Spacer(1, 8),
    ])


def make_styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle("Name", parent=base["Title"], fontName=BOLD, fontSize=24, leading=27, textColor=INK, alignment=TA_CENTER, spaceAfter=3),
        "position": ParagraphStyle("Position", parent=base["Normal"], fontName=BOLD, fontSize=11, leading=14, textColor=BLUE, alignment=TA_CENTER, spaceAfter=4),
        "contact": ParagraphStyle("Contact", parent=base["Normal"], fontName=REGULAR, fontSize=8.7, leading=11, textColor=MUTED, alignment=TA_CENTER, spaceAfter=9),
        "section": ParagraphStyle("Section", parent=base["Heading2"], fontName=BOLD, fontSize=10, leading=12, textColor=BLUE, uppercase=True, spaceBefore=7, spaceAfter=5, borderWidth=0, borderPadding=0),
        "summary": ParagraphStyle("Summary", parent=base["BodyText"], fontName=REGULAR, fontSize=9.2, leading=12.1, textColor=INK, spaceAfter=3),
        "intro": ParagraphStyle("Intro", parent=base["BodyText"], fontName=REGULAR, fontSize=10.2, leading=13.6, textColor=INK, alignment=TA_LEFT, spaceAfter=8),
        "role": ParagraphStyle("Role", parent=base["BodyText"], fontName=REGULAR, fontSize=9.8, leading=12, textColor=INK),
        "date": ParagraphStyle("Date", parent=base["BodyText"], fontName=REGULAR, fontSize=8.5, leading=11, textColor=MUTED, alignment=2),
        "bullet": ParagraphStyle("Bullet", parent=base["BodyText"], fontName=REGULAR, fontSize=8.9, leading=11.4, leftIndent=10, firstLineIndent=-7, textColor=INK, spaceAfter=1.5),
        "evidence_title": ParagraphStyle("EvidenceTitle", parent=base["Heading3"], fontName=BOLD, fontSize=10, leading=12, textColor=INK, spaceAfter=1),
        "evidence_meta": ParagraphStyle("EvidenceMeta", parent=base["BodyText"], fontName=BOLD, fontSize=8.4, leading=10.5, textColor=BLUE, spaceAfter=2),
        "link": ParagraphStyle("Link", parent=base["BodyText"], fontName=REGULAR, fontSize=8, leading=10, textColor=BLUE),
        "small": ParagraphStyle("Small", parent=base["BodyText"], fontName=REGULAR, fontSize=8.5, leading=11, textColor=MUTED),
    }


def header(styles):
    return [
        paragraph("PETE GHIORSE", styles["name"]),
        paragraph("AI/ML PRODUCT LEADER | GROUP PRODUCT MANAGER | FOUNDER", styles["position"]),
        paragraph(
            'New York City | Open to regular Bay Area travel | '
            '<link href="mailto:pmghiorse@gmail.com" color="#2b4a87">pmghiorse@gmail.com</link> | '
            '<link href="https://peterghiorse.com" color="#2b4a87">peterghiorse.com</link> | '
            '<link href="https://linkedin.com/in/peteghiorse" color="#2b4a87">LinkedIn</link> | '
            '<link href="https://github.com/pghio" color="#2b4a87">GitHub</link>',
            styles["contact"],
        ),
    ]


def page_number(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.line(0.65 * inch, 0.46 * inch, 7.85 * inch, 0.46 * inch)
    canvas.setFillColor(MUTED)
    canvas.setFont(REGULAR, 7.5)
    canvas.drawString(0.65 * inch, 0.28 * inch, "Pete Ghiorse | peterghiorse.com")
    canvas.drawRightString(7.85 * inch, 0.28 * inch, f"Page {doc.page}")
    canvas.restoreState()


def build():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    styles = make_styles()

    doc = BaseDocTemplate(
        str(OUTPUT_PDF),
        pagesize=LETTER,
        leftMargin=0.65 * inch,
        rightMargin=0.65 * inch,
        topMargin=0.52 * inch,
        bottomMargin=0.58 * inch,
        title="Pete Ghiorse - AI/ML Product Leader Resume",
        author="Pete Ghiorse",
        subject="Group Product Manager, Director of Product Management, Principal Product Manager, and Head of AI Product roles",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="resume")
    doc.addPageTemplates([PageTemplate(id="resume", frames=[frame], onPage=page_number)])

    story = header(styles)
    story.extend([
        paragraph("PROFILE", styles["section"]),
        paragraph(
            "I lead AI/ML products, build production agents, and publish rigorous evaluations of how they behave. "
            "My work connects product strategy, cross-functional execution, hands-on prototyping, model evaluation, and the operating judgment required to move from an impressive demo to a trustworthy product.",
            styles["intro"],
        ),
        paragraph("EXPERIENCE", styles["section"]),
        role(
            "Capital One",
            "Group Product Manager, AI/ML",
            "2022 - Present",
            "Lead product direction for ML-powered spend controls and fraud detection.",
            [
                "Own product strategy and roadmap decisions for AI/ML-dependent experiences.",
                "Lead cross-functional work across engineering, data science, design, and risk partners.",
                "Translate model uncertainty and operating constraints into product boundaries and launch criteria.",
            ],
            styles,
        ),
        role(
            "Honeydew",
            "Founder",
            "2025 - Present",
            "Build a multimodal family-coordination agent and use it as a production lab for model behavior, evaluation, and trust.",
            [
                "Own discovery, product strategy, implementation, instrumentation, evaluation, and distribution.",
                "Turn voice, text, and photo input into calendars, lists, reminders, and shared household plans.",
                "Designed a 227-scenario restraint study across six models and 4,086 calls, with methods, failures, and limitations published.",
                "Built a separate 2,800-call model-selection benchmark and preserved it as a dated, prompt-coupled case study.",
            ],
            styles,
        ),
        role(
            "GiveTide",
            "Co-Founder",
            "2017 - 2022",
            "Co-founded and ran a charitable-giving fintech product for five years before its acquisition in 2022.",
            [
                "Led the product from concept through launch, operation, and acquisition.",
                "Worked across product, customer discovery, full-stack implementation, and company building.",
            ],
            styles,
        ),
        paragraph("EDUCATION", styles["section"]),
        paragraph("<b>University of Richmond, Robins School of Business</b> | B.S. Finance &amp; Economics | Magna Cum Laude", styles["summary"]),
        PageBreak(),
    ])

    story.extend(header(styles))
    story.extend([
        paragraph("SELECTED PUBLIC EVIDENCE", styles["section"]),
        evidence(
            "Agent restraint evaluation",
            "June 24, 2026 | 227 scenarios | 6 models | 3 trials each | 4,086 calls | 14 parse failures disclosed",
            "Measured act/ask/confirm/chat behavior on synthetic household scenarios. The useful result was not one leaderboard: safety, messy-input robustness, steerability, and judge disagreement separated the models.",
            "https://github.com/pghio/agent-restraint-evals",
            styles,
        ),
        evidence(
            "Production model-selection benchmark",
            "April 15, 2026 | 8 models | 35 scenarios | 10 trials each | 2,800 calls | temperature 0.2",
            "Compared tool use, restraint, parsing, latency, and cost on one production-shaped workload. Public materials preserve the prompt-coupling caveat and exclude the proprietary frozen prompt and raw provider responses.",
            "https://github.com/pghio/llm-agent-benchmark",
            styles,
        ),
        evidence(
            "LLM discoverability field note",
            "90-day window | 13 GA4 sessions | 29 separate custom events | 10-query citation panel",
            "Re-audited an overconfident interpretation, kept sessions and events as different units, and published the corrected query panel, aggregate observations, and denominator check without visitor-level data.",
            "https://github.com/pghio/llm-discoverability-field-note",
            styles,
        ),
        paragraph("CORE CAPABILITIES", styles["section"]),
        paragraph(
            "<b>AI product leadership:</b> strategy, roadmaps, decision boundaries, governance, and cross-functional execution for products that depend on uncertain model behavior.<br/>"
            "<b>Agent evaluation and safety:</b> act/ask/confirm policy, destructive-action guard cases, messy-input robustness, and production-shaped evaluation design.<br/>"
            "<b>Multimodal systems:</b> voice, text, images, tool orchestration, and the product decisions that make an agent useful outside a demo.<br/>"
            "<b>Evidence-backed communication:</b> methods, limitations, negative results, corrections, and visual explanation that let readers inspect the reasoning.",
            styles["summary"],
        ),
        paragraph("WORKING PRACTICE", styles["section"]),
        paragraph(
            "Build -> Instrument -> Evaluate -> Publish -> Revise. AI assists with research, red-teaming, implementation, and editing. I own the thesis, source selection, evaluation design, factual claims, accepted code, and final editorial judgment.",
            styles["summary"],
        ),
        paragraph("TARGET ROLES", styles["section"]),
        paragraph(
            "Group Product Manager | Director of Product Management | Principal Product Manager | Head of AI Product",
            styles["summary"],
        ),
    ])

    doc.build(story)
    shutil.copyfile(OUTPUT_PDF, PUBLIC_PDF)
    print(f"Generated {OUTPUT_PDF}")
    print(f"Copied {PUBLIC_PDF}")


if __name__ == "__main__":
    build()
