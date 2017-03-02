function kmlGen(routeName,coRoute)
docNode = com.mathworks.xml.XMLUtils.createDocument('kml');
docRootNode = docNode.getDocumentElement;
docRootNode.setAttribute('xmlns','http://www.opengis.net/kml/2.2');

nodeDocument = docNode.createElement('Document');
    nodeStyle = docNode.createElement('Style');
    nodeStyle.setAttribute('id', 'pathBoldRed');
        nodeLineStyle = docNode.createElement('LineStyle');
            nodeColor = docNode.createElement('color');
            nodeColor.appendChild(docNode.createTextNode(sprintf('ffffff00')));
            nodeLineStyle.appendChild(nodeColor);            
            nodeWidth = docNode.createElement('width');
            nodeWidth.appendChild(docNode.createTextNode(sprintf('2')));
            nodeLineStyle.appendChild(nodeWidth);
        nodeStyle.appendChild(nodeLineStyle);
    nodeDocument.appendChild(nodeStyle);

xmlFileName = [routeName '.kml'];

lonAll = coRoute(:,1); latAll = coRoute(:,2);
rdType = coRoute(:,4);
    
corStart = 1;
for cor=2:length(coRoute(:,1))
    if coRoute(cor,4)~=coRoute(corStart,4)||cor==length(coRoute)
        lon = lonAll(corStart:cor-1);
        lat = latAll(corStart:cor-1);            
        rp = coRoute(corStart,4);
        if rp==1
            routeName = 'Local';
        elseif rp==2
            routeName = 'On Ramp';
        elseif rp==3
            routeName = 'Freeway';
        elseif rp==4
            routeName = 'Inter Freeway Ramp';
        elseif rp==5
            routeName = 'Off Ramp';
        end
        corStart = cor;
        % disp(routeName);

        nodePlaceMark = docNode.createElement('Placemark');
            nodeName = docNode.createElement('name');
            nodeName.appendChild(docNode.createTextNode(sprintf(routeName)));
            nodePlaceMark.appendChild(nodeName);
            nodeDescription = docNode.createElement('description');
            nodePlaceMark.appendChild(nodeDescription);
            nodeStyleURL = docNode.createElement('styleUrl');
            nodeStyleURL.appendChild(docNode.createTextNode(sprintf('#pathBoldRed')));
            nodePlaceMark.appendChild(nodeStyleURL);
            nodeLineString = docNode.createElement('LineString');
                nodeTessellate = docNode.createElement('tessellate');
                nodeTessellate.appendChild(docNode.createTextNode(sprintf('1')));
                nodeLineString.appendChild(nodeTessellate);

                nodeCoordinates = docNode.createElement('coordinates');
                % coordinateStr = '\n';
                % nodeCoordinates.appendChild(docNode.createTextNode(sprintf(coordinateStr)));
                for i=1:min(size(lon,1), size(lat, 1))
                    coordinateStr = [num2str(lon(i)) ',' num2str(lat(i)), ',50 '];
                    nodeCoordinates.appendChild(docNode.createTextNode(sprintf(coordinateStr)));
                end
                % nodeCoordinates.appendChild(docNode.createTextNode(sprintf('\n')));
                nodeLineString.appendChild(nodeCoordinates);
            nodePlaceMark.appendChild(nodeLineString);
        nodeDocument.appendChild(nodePlaceMark);
    end
end

docRootNode.appendChild(nodeDocument);

docNode.appendChild(docNode.createComment('this is a comment'));

xmlwrite(xmlFileName,docNode);