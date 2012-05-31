# encoding: utf-8

require 'fakeweb'

FakeWeb.allow_net_connect = false

def fake_rss_for_url(url)
  FakeWeb.register_uri(:any, %r|http://|, :body =>
    <<-eos
        <rss xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/" version="2.0">
        <channel>
        <title>The Real Deal New York</title>
        <atom:link href="http://therealdeal.com/feed/" rel="self" type="application/rss+xml"/>
        <link>http://therealdeal.com</link>
        <description/>
        <lastBuildDate>Wed, 30 May 2012 23:03:33 +0000</lastBuildDate>
        <language>en</language>
        <sy:updatePeriod>hourly</sy:updatePeriod>
        <sy:updateFrequency>1</sy:updateFrequency>
        <generator>http://wordpress.org/?v=3.3.2</generator>
        <item>
        <title>
        Court rules on motion to dismiss discrimination case against Silverstein
        </title>
        <link>
        http://therealdeal.com/blog/2012/05/30/court-denies-motion-to-dismiss-discrimination-case-against-silverstein-properties/
        </link>
        <comments>
        http://therealdeal.com/blog/2012/05/30/court-denies-motion-to-dismiss-discrimination-case-against-silverstein-properties/#comments
        </comments>
        <pubDate>Wed, 30 May 2012 22:45:57 +0000</pubDate>
        <dc:creator>Katherine Clarke/TRD</dc:creator>
        <category>
        <![CDATA[ Home Page ]]>
        </category>
        <category>
        <![CDATA[ Catherine Giliberti ]]>
        </category>
        <category>
        <![CDATA[ Larry Silverstein ]]>
        </category>
        <category>
        <![CDATA[ silverstein properties ]]>
        </category>
        <guid isPermaLink="false">http://therealdeal.com/?p=183133</guid>
        <description>
        <![CDATA[
        A New York State Supreme Court judge has denied a motion to dismiss several causes of action in a discrimination lawsuit filed by former Silverstein Properties executive Catherine Giliberti against her former employer, paving the way for the case to continue, according to court records filed today. But the judge, Manuel Mendez, did dismiss one key cause of action, which would have allowed Giliberti to claim damages on the $1.6 million in ownership interests she <a href="http://therealdeal.com/blog/2012/05/30/court-denies-motion-to-dismiss-discrimination-case-against-silverstein-properties/" title="Continue to Court rules on motion to dismiss discrimination case against Silverstein" class="read-more-link">[more]</a>
        ]]>
        </description>
        <wfw:commentRss>
        http://therealdeal.com/blog/2012/05/30/court-denies-motion-to-dismiss-discrimination-case-against-silverstein-properties/feed/
        </wfw:commentRss>
        <slash:comments>0</slash:comments>
        </item>
        <item>
        <title>W’burg rental conversion leases up in five weeks</title>
        <link>
        http://therealdeal.com/blog/2012/05/30/williamsburg-rental-conversion-leases-up-in-five-weeks/
        </link>
        <comments>
        http://therealdeal.com/blog/2012/05/30/williamsburg-rental-conversion-leases-up-in-five-weeks/#comments
        </comments>
        <pubDate>Wed, 30 May 2012 22:20:07 +0000</pubDate>
        <dc:creator>Adam Fusfeld/TRD</dc:creator>
        <category>
        <![CDATA[ Home Page ]]>
        </category>
        <category>
        <![CDATA[ 142 north 6th street ]]>
        </category>
        <category>
        <![CDATA[ aptsandlofts.com ]]>
        </category>
        <category>
        <![CDATA[ david maundrell ]]>
        </category>
        <category>
        <![CDATA[ jardin ]]>
        </category>
        <guid isPermaLink="false">http://therealdeal.com/?p=183149</guid>
        <description>
        <![CDATA[
        Just five weeks after the units hit the rental market, Williamsburg&#8217;s Jardin building is fully leased, according to its aptsandlofts.com marketing team. When the last lease was signed late last week, it marked the end of the latest chapter in a long and troubled history for the 44-unit building at 142 North 6th Street. The building first hit the market as a condominium in 2008 under Prudential Douglas Elliman, and 39 units entered contract, before <a href="http://therealdeal.com/blog/2012/05/30/williamsburg-rental-conversion-leases-up-in-five-weeks/" title="Continue to W'burg rental conversion leases up in five weeks" class="read-more-link">[more]</a>
        ]]>
        </description>
        <wfw:commentRss>
        http://therealdeal.com/blog/2012/05/30/williamsburg-rental-conversion-leases-up-in-five-weeks/feed/
        </wfw:commentRss>
        <slash:comments>0</slash:comments>
        </item>
        <item>
        <title>Receiver named at historic Harlem rental</title>
        <link>
        http://therealdeal.com/blog/2012/05/30/vantage-and-area-propertys-distressed-harlem-building-gets-court-appointed-receiver/
        </link>
        <comments>
        http://therealdeal.com/blog/2012/05/30/vantage-and-area-propertys-distressed-harlem-building-gets-court-appointed-receiver/#comments
        </comments>
        <pubDate>Wed, 30 May 2012 21:30:58 +0000</pubDate>
        <dc:creator>news</dc:creator>
        <category>
        <![CDATA[ Featured ]]>
        </category>
        <category>
        <![CDATA[ Home Page ]]>
        </category>
        <category>
        <![CDATA[ "foreclosures" ]]>
        </category>
        <category>
        <![CDATA[ area property partners ]]>
        </category>
        <category>
        <![CDATA[ vantage properties ]]>
        </category>
        <guid isPermaLink="false">http://therealdeal.com/?p=183102</guid>
        <description>
        <![CDATA[
        A state Supreme Court judge has named a receiver to oversee the restoration of the Beaumont, a historic 11-story rental building in Harlem, the latest in a series of foreclosures against Vantage Properties and Area Property Partners. New York state Supreme Court justice Jeffrey Oing named attorney Bradley Marks as a receiver to oversee the building at 730 Riverside Drive, a 64-unit Beaux Arts residence that was originally developed by Blum &#38; Blum in 1912. <a href="http://therealdeal.com/blog/2012/05/30/vantage-and-area-propertys-distressed-harlem-building-gets-court-appointed-receiver/" title="Continue to Receiver named at historic Harlem rental" class="read-more-link">[more]</a>
        ]]>
        </description>
        <wfw:commentRss>
        http://therealdeal.com/blog/2012/05/30/vantage-and-area-propertys-distressed-harlem-building-gets-court-appointed-receiver/feed/
        </wfw:commentRss>
        <slash:comments>0</slash:comments>
        </item>
        <item>
        <title>
        Developers seek approval for 25-story Chrystie Street project, the suspicious story behind a $7M Chelsea townhouse sale … and more
        </title>
        <link>
        http://therealdeal.com/blog/2012/05/30/hed-developers-seek-approval-for-25-story-chrystie-street-project-the-suspicious-story-behind-a-7m-chelsea-townhouse-sale-and-more/
        </link>
        <comments>
        http://therealdeal.com/blog/2012/05/30/hed-developers-seek-approval-for-25-story-chrystie-street-project-the-suspicious-story-behind-a-7m-chelsea-townhouse-sale-and-more/#comments
        </comments>
        <pubDate>Wed, 30 May 2012 21:00:06 +0000</pubDate>
        <dc:creator>news</dc:creator>
        <category>
        <![CDATA[ Home Page ]]>
        </category>
        <guid isPermaLink="false">http://therealdeal.com/?p=183072</guid>
        <description>
        <![CDATA[
        <div style="width: 580px; font-size: 80%; line-height: normal; color: rgb(112, 112, 112); text-align: left; margin-bottom: 0.5em;"><a href="http://therealdeal.com/blog/2012/05/30/hed-developers-seek-approval-for-25-story-chrystie-street-project-the-suspicious-story-behind-a-7m-chelsea-townhouse-sale-and-more/"><img src="http://therealdeal.com/wp-content/uploads/2012/05/McDonalds.jpg" style="border: 1px solid black;" alt="alternate
         text"></a><br />The McDonald's in a Georgian mansion (credit: ScoutingNY)</div>


         Manhattan CB3 to meet next week to discuss proposed <strong>25-story, 195,000-sf project at 215 Chrystie Street</strong>. Was a <strong>Chelsea townhouse</strong> that's now on market for $7M vacated for wise investment or out of a suspicious swindle scheme? <strong>Brooklyn food start-ups</strong> avoid high rents by sharing spaces, survey says. Forget golden arches -- this <strong>LI McDonald's</strong> is located inside a historic Georgian mansion. Finally, <strong>Christopher Columbus statue</strong> in Columbus Circle to get its own living room. Read these stories and <a href="http://therealdeal.com/blog/2012/05/30/hed-developers-seek-approval-for-25-story-chrystie-street-project-the-suspicious-story-behind-a-7m-chelsea-townhouse-sale-and-more/">more</a> after the jump.
        ]]>
        </description>
        <wfw:commentRss>
        http://therealdeal.com/blog/2012/05/30/hed-developers-seek-approval-for-25-story-chrystie-street-project-the-suspicious-story-behind-a-7m-chelsea-townhouse-sale-and-more/feed/
        </wfw:commentRss>
        <slash:comments>0</slash:comments>
        </item>
        <item>
        <title>IHOP signs for 49 years in West Village</title>
        <link>
        http://therealdeal.com/blog/2012/05/30/ashkenazys-trihop-signs-49-year-west-village-ihop-lease/
        </link>
        <comments>
        http://therealdeal.com/blog/2012/05/30/ashkenazys-trihop-signs-49-year-west-village-ihop-lease/#comments
        </comments>
        <pubDate>Wed, 30 May 2012 20:30:47 +0000</pubDate>
        <dc:creator>news</dc:creator>
        <category>
        <![CDATA[ Featured ]]>
        </category>
        <category>
        <![CDATA[ Home Page ]]>
        </category>
        <category>
        <![CDATA[ 80 carmine street ]]>
        </category>
        <category>
        <![CDATA[ allen rosenberg ]]>
        </category>
        <category>
        <![CDATA[ alrose group ]]>
        </category>
        <category>
        <![CDATA[ ashkenazy acquisition ]]>
        </category>
        <category>
        <![CDATA[ ihop ]]>
        </category>
        <category>
        <![CDATA[ kevin salmon ]]>
        </category>
        <category>
        <![CDATA[ salmon and marshall real estate investments ]]>
        </category>
        <guid isPermaLink="false">http://therealdeal.com/?p=183086</guid>
        <description>
        <![CDATA[
        The Long Island-based Alrose Group appears to be turning a corner. The landlord investor signed a 49-year lease with the local International House of Pancakes franchisee last week for its retail space at 80 Carmine Street. And, yesterday it cleared a crucial hurdle to stabilize a once-troubled Long Island building that’s home to the luxury Allegria Hotel. Trihop &#8212; an affiliate of Ashkenazy Acquisition that owns the tri-state area franchise rights for the pancake house <a href="http://therealdeal.com/blog/2012/05/30/ashkenazys-trihop-signs-49-year-west-village-ihop-lease/" title="Continue to IHOP signs for 49 years in West Village" class="read-more-link">[more]</a>
        ]]>
        </description>
        <wfw:commentRss>
        http://therealdeal.com/blog/2012/05/30/ashkenazys-trihop-signs-49-year-west-village-ihop-lease/feed/
        </wfw:commentRss>
        <slash:comments>0</slash:comments>
        </item>
        <item>
        <title>Jehovah’s Witnesses puts EV property up for grabs</title>
        <link>
        http://therealdeal.com/blog/2012/05/30/jehovahs-witnesses-puts-ev-property-up-for-grabs/
        </link>
        <comments>
        http://therealdeal.com/blog/2012/05/30/jehovahs-witnesses-puts-ev-property-up-for-grabs/#comments
        </comments>
        <pubDate>Wed, 30 May 2012 20:00:58 +0000</pubDate>
        <dc:creator>news</dc:creator>
        <category>
        <![CDATA[ Home Page ]]>
        </category>
        <category>
        <![CDATA[ 67 avenue c ]]>
        </category>
        <category>
        <![CDATA[ jehovah's witnesses ]]>
        </category>
        <category>
        <![CDATA[ kingdom hall ]]>
        </category>
        <category>
        <![CDATA[ massey knakal ]]>
        </category>
        <category>
        <![CDATA[ Robert Knakal ]]>
        </category>
        <guid isPermaLink="false">http://therealdeal.com/?p=183073</guid>
        <description>
        <![CDATA[
        In the Jehovah&#8217;s Witnesses&#8217; latest move to prepare for an upstate relocation, the group has put another piece of property on the market, but not in Brooklyn. This time it&#8217;s seeking a buyer for an East Village property. Crain&#8217;s reported Jehovah&#8217;s Witnesses is selling Kingdom Hall, a worship space located at 67 Avenue C at 5th Street. So far there&#8217;s no asking price for the 3,050-square-foot, two-story building, which sits on land zoned for 10,000 <a href="http://therealdeal.com/blog/2012/05/30/jehovahs-witnesses-puts-ev-property-up-for-grabs/" title="Continue to Jehovah's Witnesses puts EV property up for grabs" class="read-more-link">[more]</a>
        ]]>
        </description>
        <wfw:commentRss>
        http://therealdeal.com/blog/2012/05/30/jehovahs-witnesses-puts-ev-property-up-for-grabs/feed/
        </wfw:commentRss>
        <slash:comments>1</slash:comments>
        </item>
        <item>
        <title>
        Buyers’ interest in U.S. foreclosures peaks just as inventory wanes
        </title>
        <link>
        http://therealdeal.com/blog/2012/05/30/buyers-interest-in-u-s-foreclosures-peaks-just-as-inventory-wanes/
        </link>
        <comments>
        http://therealdeal.com/blog/2012/05/30/buyers-interest-in-u-s-foreclosures-peaks-just-as-inventory-wanes/#comments
        </comments>
        <pubDate>Wed, 30 May 2012 19:30:10 +0000</pubDate>
        <dc:creator>news</dc:creator>
        <category>
        <![CDATA[ Home Page ]]>
        </category>
        <category>
        <![CDATA[ distressed sales ]]>
        </category>
        <category>
        <![CDATA[ national association of realtors ]]>
        </category>
        <category>
        <![CDATA[ pending sales ]]>
        </category>
        <category>
        <![CDATA[ realtor.com ]]>
        </category>
        <guid isPermaLink="false">http://therealdeal.com/?p=183063</guid>
        <description>
        <![CDATA[
        Buyers&#8217; interest in purchasing foreclosed properties increased 158 percent over the past two and a half years, according to a Realtor.com survey cited by Bloomberg News. But at the same time the supply of such properties is plummeting, CNBC said, which is leading to weakening sales contracts, especially in the west and the south, regions where foreclosures are especially prominent. The National Association of Realtors reported today that pending home sales in the United States <a href="http://therealdeal.com/blog/2012/05/30/buyers-interest-in-u-s-foreclosures-peaks-just-as-inventory-wanes/" title="Continue to Buyers' interest in U.S. foreclosures peaks just as inventory wanes" class="read-more-link">[more]</a>
        ]]>
        </description>
        <wfw:commentRss>
        http://therealdeal.com/blog/2012/05/30/buyers-interest-in-u-s-foreclosures-peaks-just-as-inventory-wanes/feed/
        </wfw:commentRss>
        <slash:comments>0</slash:comments>
        </item>
        <item>
        <title>
        Chess player of “Searching for Bobby Fischer” fame buys West Village co-op
        </title>
        <link>
        http://therealdeal.com/blog/2012/05/30/real-life-bobby-fischer-buys-les-co-op/
        </link>
        <comments>
        http://therealdeal.com/blog/2012/05/30/real-life-bobby-fischer-buys-les-co-op/#comments
        </comments>
        <pubDate>Wed, 30 May 2012 19:00:23 +0000</pubDate>
        <dc:creator>news</dc:creator>
        <category>
        <![CDATA[ Home Page ]]>
        </category>
        <category>
        <![CDATA[ brown harris stevens ]]>
        </category>
        <category>
        <![CDATA[ Lisa Lippman ]]>
        </category>
        <category>
        <![CDATA[ scott moore ]]>
        </category>
        <guid isPermaLink="false">http://therealdeal.com/?p=183058</guid>
        <description>
        <![CDATA[
        Chess phenom Josh Waitzkin has sold his three-bedroom co-op at 200 West Houston Street, the New York Observer reported. The chess champ, on whom the film &#8220;Searching for Bobby Fischer&#8221; is based, nabbed the pad, between Downing and Bedford streets, for only $1.9 million. It was listed in 2009 for $2.5 million, the Observer said. The corner duplex apartment has 10-foot ceilings and is part of a 29-unit &#8220;intimate co-op,&#8221; according to Streeteasy.com. Lisa Lippman <a href="http://therealdeal.com/blog/2012/05/30/real-life-bobby-fischer-buys-les-co-op/" title="Continue to Chess player of "Searching for Bobby Fischer" fame buys West Village co-op" class="read-more-link">[more]</a>
        ]]>
        </description>
        <wfw:commentRss>
        http://therealdeal.com/blog/2012/05/30/real-life-bobby-fischer-buys-les-co-op/feed/
        </wfw:commentRss>
        <slash:comments>0</slash:comments>
        </item>
        <item>
        <title>On the hunt for a real estate job?</title>
        <link>
        http://therealdeal.com/blog/2012/05/30/on-the-hunt-for-a-real-estate-job-2/
        </link>
        <comments>
        http://therealdeal.com/blog/2012/05/30/on-the-hunt-for-a-real-estate-job-2/#comments
        </comments>
        <pubDate>Wed, 30 May 2012 18:30:22 +0000</pubDate>
        <dc:creator>news</dc:creator>
        <category>
        <![CDATA[ Home Page ]]>
        </category>
        <category>
        <![CDATA[ job board ]]>
        </category>
        <category>
        <![CDATA[ The Real Deal ]]>
        </category>
        <category>
        <![CDATA[ the real deal job board ]]>
        </category>
        <guid isPermaLink="false">http://therealdeal.com/?p=183052</guid>
        <description>
        <![CDATA[
        Hey, if you&#8217;re looking for a job in the real estate industry, The Real Deal&#8217;s job board is the perfect starting point. The most recent company to post a job is Garfield Realty, which is looking to hire a licensed real estate sales agent. For all real estate-related job opportunities, see The Real Deal&#8217;s &#8221;jobs&#8221; tab at the top of the website or click here. Jobs are searchable by title, company, location and job type. And
        ]]>
        </description>
        <wfw:commentRss>
        http://therealdeal.com/blog/2012/05/30/on-the-hunt-for-a-real-estate-job-2/feed/
        </wfw:commentRss>
        <slash:comments>0</slash:comments>
        </item>
        <item>
        <title>Manhattan office leasing volume picks up</title>
        <link>
        http://therealdeal.com/blog/2012/05/30/manhattan-office-leasing-volume-picks-up/
        </link>
        <comments>
        http://therealdeal.com/blog/2012/05/30/manhattan-office-leasing-volume-picks-up/#comments
        </comments>
        <pubDate>Wed, 30 May 2012 18:00:41 +0000</pubDate>
        <dc:creator>news</dc:creator>
        <category>
        <![CDATA[ Home Page ]]>
        </category>
        <category>
        <![CDATA[ jones lang lasalle ]]>
        </category>
        <category>
        <![CDATA[ Manhattan Office Leasing ]]>
        </category>
        <category>
        <![CDATA[ peter riguardi ]]>
        </category>
        <category>
        <![CDATA[ second quarter 2012 ]]>
        </category>
        <guid isPermaLink="false">http://therealdeal.com/?p=183036</guid>
        <description>
        <![CDATA[
        Office leasing activity in Manhattan so far this quarter has beaten the volume tallied from the first quarter of 2012, Crain&#8217;s reported, citing Jones Lang LaSalle data. This month alone, about 2.3 million square feet were leased after 4 million square feet were taken up in April. A total of 5.6 million square feet were leased around Manhattan during the first quarter. However, these numbers are not caught up with the amount of square feet <a href="http://therealdeal.com/blog/2012/05/30/manhattan-office-leasing-volume-picks-up/" title="Continue to Manhattan office leasing volume picks up" class="read-more-link">[more]</a>
        ]]>
        </description>
        <wfw:commentRss>
        http://therealdeal.com/blog/2012/05/30/manhattan-office-leasing-volume-picks-up/feed/
        </wfw:commentRss>
        <slash:comments>0</slash:comments>
        </item>
        </channel>
        </rss>
    eos
  )
end