<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/loanApplication">
    <div>
      <h2>Loan Application Details</h2>
      <table border="1" cellpadding="5">
        <tr>
          <th>Applicant Name</th>
          <th>Age</th>
          <th>Loan Amount</th>
          <th>Currency</th>
          <th>Purpose</th>
          <th>Duration (months)</th>
          <th>Status</th>
        </tr>
        <xsl:for-each select="applications/application">
          <tr>
            <td><xsl:value-of select="applicant/name"/></td>
            <td><xsl:value-of select="applicant/age"/></td>
            <td><xsl:value-of select="loan/@amount"/></td>
            <td><xsl:value-of select="loan/@currency"/></td>
            <td><xsl:value-of select="loan/purpose"/></td>
            <td><xsl:value-of select="loan/duration"/></td>
            <td><xsl:value-of select="status"/></td>
          </tr>
        </xsl:for-each>
      </table>
    </div>
  </xsl:template>
</xsl:stylesheet>
