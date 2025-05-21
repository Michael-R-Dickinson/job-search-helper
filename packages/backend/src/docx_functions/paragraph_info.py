from docx.oxml.ns import qn

from docx.text.paragraph import Paragraph


def has_spacing(para, space_pt_threshold=6):
    """
    True if space_before or space_after ≥ space_pt_threshold (in points).

    space_before and after are the extra space before and after the paragraph
    usually headings added space before
    """
    fmt = para.paragraph_format
    for attr in ("space_before", "space_after"):
        val = getattr(fmt, attr)
        pt = getattr(val, "pt", None)
        if pt is not None and pt >= space_pt_threshold:
            return True
    return False


def has_border(para):
    """
    True if the paragraph has any border defined in its pPr.
    """
    pPr = para._p.pPr
    if pPr is None:
        return False
    # look for any <w:pBdr> (paragraph borders)
    return pPr.find(qn("w:pBdr")) is not None


def get_list_indent_level(para: Paragraph) -> int | None:
    """
    If `para` is a list item, returns its level as an int (0,1,2,…).
    Otherwise returns None.
    """
    pPr = para._p.pPr
    if pPr is None:
        return None
    numPr = pPr.find(qn("w:numPr"))
    if numPr is None:
        return None
    ilvl = numPr.find(qn("w:ilvl"))
    if ilvl is None:
        return None
    return int(ilvl.get(qn("w:val")))
